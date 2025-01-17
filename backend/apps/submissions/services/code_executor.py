import os
import logging
import asyncio
import uuid

logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

class CodeExecutor:
    def __init__(self, submission, test_cases):
        self.submission = submission
        self.test_cases = test_cases
        self.base_dir = os.path.dirname(os.path.abspath(__file__))

    async def execute(self):
        try:
            language_handlers = {
                'py': self._handle_python,
                'cpp': self._handle_cpp
            }

            handler = language_handlers.get(self.submission.language.lower())
            if not handler:
                return {
                    'message': f'{self.submission.language} not supported',
                    'error': True,
                    'success': False,
                    'output_value': '',
                    'input': '',
                    'expected_output': ''
                }

            return await handler()
        except Exception as e:
            logger.error(f"Error in execution: {str(e)}")
            return {
                'message': f'Execution Error: {str(e)}',
                'error': True,
                'success': False
            }

    async def _build_and_run_container(self, language_dir, container_name):
        try:
            # Write the submission code to the respective source file
            source_file = os.path.join(language_dir, 'main.py' if self.submission.language == 'py' else 'main.cpp')
            logger.debug(f"Writing submitted code to: {source_file}")
            with open(source_file, 'w') as f:
                f.write(self.submission.code)

            # Build the Docker container
            build_command = ['docker', 'build', '-t', container_name, language_dir]
            logger.debug(f"Building container with command: {' '.join(build_command)}")
            build_process = await asyncio.create_subprocess_exec(
                *build_command,
                stdout=asyncio.subprocess.PIPE,
                stderr=asyncio.subprocess.PIPE
            )
            stdout, stderr = await build_process.communicate()

            if build_process.returncode != 0:
                logger.error(f"Docker build failed: {stderr.decode()}")
                return {
                    'message': f'Build Error: {stderr.decode()}',
                    'error': True,
                    'success': False
                }

            return await self._run_tests_in_container(container_name)

        except Exception as e:
            logger.error(f"Error in building/running container: {str(e)}")
            return {
                'message': f'Error: {str(e)}',
                'error': True,
                'success': False
            }

    async def _handle_python(self):
        python_dir = os.path.join(self.base_dir, 'python')
        container_name = f'coderunner_python_{uuid.uuid4().hex}'
        return await self._build_and_run_container(python_dir, container_name)

    async def _handle_cpp(self):
        cpp_dir = os.path.join(self.base_dir, 'cpp')
        container_name = f'coderunner_cpp_{uuid.uuid4().hex}'
        return await self._build_and_run_container(cpp_dir, container_name)

    async def _run_tests_in_container(self, container_name):
        all_tests_passed = True
        results = []

        try:
            # Create a list of test cases to run concurrently
            tasks = []
            for test_case in self.test_cases:
                input_data = test_case.get('input', '').replace('\r', '')
                expected_output = test_case.get('expected_test_cases', '').replace('\r', '')
                logger.debug(f"Preparing test with input: {input_data}")

                tasks.append(self._run_single_test(container_name, input_data, expected_output, results))

            # Await all test tasks
            await asyncio.gather(*tasks)

        finally:
            await self._cleanup_container(container_name)

        # Return results
        return self._generate_test_case_results(all_tests_passed, results)

    async def _run_single_test(self, container_name, input_data, expected_output, results):
        try:
            run_command = [
                'docker', 'run',
                '--rm',
                '--network', 'none',
                '--memory', '128m',
                '--cpus', '0.5',
                '--user', 'nobody',
                '--ulimit', 'nproc=32:32',
                '-i',
                container_name
            ]

            process = await asyncio.create_subprocess_exec(
                *run_command,
                stdin=asyncio.subprocess.PIPE,
                stdout=asyncio.subprocess.PIPE,
                stderr=asyncio.subprocess.PIPE
            )

            stdout, stderr = await asyncio.wait_for(
                process.communicate(input=input_data.encode()),
                timeout=5.0
            )
            output = stdout.decode().strip()

            if stderr:
                logger.error(f"Container stderr: {stderr.decode()}")

            test_result = {
                'input': input_data,
                'output_value': output,
                'expected_output': expected_output,
                'error': output != expected_output.strip()
            }
            results.append(test_result)

        except asyncio.TimeoutError:
            logger.error(f"Test case timed out for input: {input_data}")
            results.append({
                'input': input_data,
                'output_value': '',
                'expected_output': expected_output,
                'error': True
            })

    async def _cleanup_container(self, container_name):
        try:
            await asyncio.create_subprocess_exec(
                'docker', 'rmi', container_name,
                stdout=asyncio.subprocess.PIPE,
                stderr=asyncio.subprocess.PIPE
            )
            logger.debug(f"Removed container image: {container_name}")
        except Exception as e:
            logger.error(f"Error removing container image: {str(e)}")

    def _generate_test_case_results(self, all_tests_passed, results):
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
