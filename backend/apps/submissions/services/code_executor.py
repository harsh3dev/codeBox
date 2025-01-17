import os
import logging
import asyncio
import uuid

logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

class CodeExecutor:
    def __init__(self, submission, test_cases, timeout=5.0):
        self.submission = submission
        self.test_cases = test_cases
        self.base_dir = os.path.dirname(os.path.abspath(__file__))
        self.timeout = timeout

    async def execute(self):
        try:
            handler = self._get_language_handler()
            if not handler:
                return self._create_error_response(f'{self.submission.language} not supported')

            return await handler()

        except Exception as e:
            logger.error(f"Execution Error: {e}")
            return self._create_error_response(f'Execution Error: {str(e)}')

    def _get_language_handler(self):
        language_handlers = {
            'py': self._handle_python,
            'cpp': self._handle_cpp
        }
        return language_handlers.get(self.submission.language.lower())

    def _create_error_response(self, message):
        return {
            'message': message,
            'error': True,
            'success': False,
            'output_value': '',
            'input': '',
            'expected_output': ''
        }

    async def _handle_cpp(self):
        return await self._handle_code('cpp', 'main.cpp')

    async def _handle_python(self):
        return await self._handle_code('python', 'main.py')

    async def _handle_code(self, language_dir, source_file_name):
        try:
            source_file = os.path.join(self.base_dir, language_dir, source_file_name)
            logger.debug(f"Writing submitted code to: {source_file}")

            # Write the submitted code to the source file
            with open(source_file, 'w') as f:
                f.write(self.submission.code)

            # Build the container
            container_name = f'coderunner_{language_dir}_{uuid.uuid4().hex}'
            build_result = await self._build_container(language_dir, container_name)
            if build_result['error']:
                return build_result

            return await self._run_tests_in_container(container_name)

        except Exception as e:
            logger.error(f"Error in {language_dir} handling: {e}")
            return self._create_error_response(f'Error: {str(e)}')

    async def _build_container(self, language_dir, container_name):
        build_command = ['docker', 'build', '-t', container_name, os.path.join(self.base_dir, language_dir)]
        logger.debug(f"Building container with command: {' '.join(build_command)}")

        try:
            build_process = await asyncio.create_subprocess_exec(
                *build_command,
                stdout=asyncio.subprocess.PIPE,
                stderr=asyncio.subprocess.PIPE
            )
            stdout, stderr = await build_process.communicate()

            if build_process.returncode != 0:
                logger.error(f"Docker build failed: {stderr.decode()}")
                return self._create_error_response(f'Build Error: {stderr.decode()}')

            return {'error': False}

        except Exception as e:
            logger.error(f"Error building container: {e}")
            return self._create_error_response(f'Build Error: {e}')

    async def _run_tests_in_container(self, container_name):
        all_tests_passed = True
        results = []

        try:
            for test_case in self.test_cases:
                input_data = test_case.get('input', '').replace('\r', '')
                expected_output = test_case.get('expected_test_cases', '').replace('\r', '')
                logger.debug(f"Running test with input: {input_data}")

                run_result = await self._run_test(container_name, input_data, expected_output)
                if run_result['error']:
                    all_tests_passed = False
                results.append(run_result)

            await self._cleanup_container(container_name)

            return self._generate_result(all_tests_passed, results)

        except Exception as e:
            logger.error(f"Error running tests: {e}")
            return self._create_error_response(f'Error: {e}')

    async def _run_test(self, container_name, input_data, expected_output):
        run_command = [
            'docker', 'run',
            '--rm',
            '--network', 'none',
            '--memory', '128m',
            '--cpus', '0.5',
            '--user', 'nobody',
            '--ulimit', 'nproc=32:32',
            '-i', container_name
        ]

        process = await asyncio.create_subprocess_exec(
            *run_command,
            stdin=asyncio.subprocess.PIPE,
            stdout=asyncio.subprocess.PIPE,
            stderr=asyncio.subprocess.PIPE
        )

        try:
            stdout, stderr = await asyncio.wait_for(process.communicate(input=input_data.encode()), timeout=self.timeout)
            output = stdout.decode().strip()

            if stderr:
                logger.error(f"Container stderr: {stderr.decode()}")

            return {
                'input': input_data,
                'output_value': output,
                'expected_output': expected_output,
                'error': output != expected_output.strip()
            }

        except asyncio.TimeoutError:
            process.kill()
            logger.error(f"Test case timed out for input: {input_data}")
            return {
                'input': input_data,
                'output_value': '',
                'expected_output': expected_output,
                'error': True
            }

    async def _cleanup_container(self, container_name):
        try:
            await asyncio.create_subprocess_exec('docker', 'rmi', container_name, stdout=asyncio.subprocess.PIPE, stderr=asyncio.subprocess.PIPE)
            logger.debug(f"Removed container image: {container_name}")
        except Exception as e:
            logger.error(f"Error removing container image: {str(e)}")

    def _generate_result(self, all_tests_passed, results):
        if all_tests_passed:
            return {
                'message': 'All Test Cases Passed',
                'error': False,
                'success': True,
                'results': results
            }
        else:
            return {
                'message': 'Test Cases Failed',
                'error': True,
                'success': False,
                'results': results
            }
