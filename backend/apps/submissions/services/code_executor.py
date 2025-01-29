import os
import logging
import asyncio
import uuid
from concurrent.futures import ThreadPoolExecutor
from functools import lru_cache

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class CodeExecutor:
    def __init__(self, submission, test_cases, timeout=5.0):
        self.submission = submission
        self.test_cases = test_cases
        self.base_dir = os.path.dirname(os.path.abspath(__file__))
        self.timeout = timeout
        self.thread_pool = ThreadPoolExecutor(max_workers=4)
        self._container_pool = set()

    async def execute(self):
        try:
            handler = self._get_language_handler()
            if not handler:
                return self._create_error_response(f'{self.submission.language} not supported')

            return await handler()

        except Exception as e:
            logger.error(f"Execution Error: {e}")
            return self._create_error_response(f'Execution Error: {str(e)}')

    @lru_cache(maxsize=32)
    def _get_language_handler(self):
        language_handlers = {
            'py': self._handle_python,
            'cpp': self._handle_cpp
        }
        return language_handlers.get(self.submission.language.lower())

    async def _handle_python(self):
        container_name = f'coderunner_python_{uuid.uuid4().hex}'

        try:
            source_file = os.path.join(self.base_dir, 'python', 'main.py')
            await self._write_file_async(source_file, self.submission.code)

            create_command = [
                'docker', 'run',
                '-d',
                '--memory=128m',
                '--cpus=0.5',
                '--network=none',
                '--name', container_name,
                'coderunner_python:latest'
            ]
            await self._run_command(create_command)

            copy_command = [
                'docker', 'cp',
                source_file,
                f'{container_name}:/code/main.py'
            ]
            await self._run_command(copy_command)

            results = await self._run_all_tests(container_name)

            await self._cleanup_container(container_name)

            return results

        except Exception as e:
            logger.error(f"Error in Python handling: {e}")
            return self._create_error_response(f'Error: {str(e)}')

    async def _handle_cpp(self):
        container_name = f'coderunner_cpp_{uuid.uuid4().hex}'

        try:
            source_file = os.path.join(self.base_dir, 'cpp', 'main.cpp')
            await self._write_file_async(source_file, self.submission.code)

            create_command = [
                'docker', 'run',
                '-d',
                '--memory=128m',
                '--cpus=0.5',
                '--network=none',
                '--name', container_name,
                'coderunner_cpp:latest'
            ]
            await self._run_command(create_command)

            copy_command = [
                'docker', 'cp',
                source_file,
                f'{container_name}:/code/main.cpp'
            ]
            await self._run_command(copy_command)

            compile_result = await self._compile_cpp(container_name)
            if compile_result['error']:
                return compile_result

            results = await self._run_all_tests(container_name)

            await self._cleanup_container(container_name)

            return results

        except Exception as e:
            logger.error(f"Error in C++ handling: {e}")
            return self._create_error_response(f'Error: {str(e)}')

    async def _write_file_async(self, filepath, content):
        def write_file():
            os.makedirs(os.path.dirname(filepath), exist_ok=True)
            with open(filepath, 'w') as f:
                f.write(content)
        await asyncio.get_event_loop().run_in_executor(self.thread_pool, write_file)

    async def _run_command(self, command):
        process = await asyncio.create_subprocess_exec(
            *command,
            stdout=asyncio.subprocess.PIPE,
            stderr=asyncio.subprocess.PIPE
        )
        await process.communicate()

    async def _compile_cpp(self, container_name):
        compile_command = [
            'docker', 'exec',
            container_name,
            'g++', '/code/main.cpp', '-o', '/code/main',
            '-O2'
        ]
        process = await asyncio.create_subprocess_exec(
            *compile_command,
            stdout=asyncio.subprocess.PIPE,
            stderr=asyncio.subprocess.PIPE
        )
        _, stderr = await process.communicate()

        if process.returncode != 0:
            return self._create_error_response(f'Compilation Error: {stderr.decode()}')
        return {'error': False}

    async def _run_all_tests(self, container_name):
        results = []
        for test_case in self.test_cases:
            if not isinstance(test_case, dict):
                results.append({
                    'test_case': test_case,
                    'output': '',
                    'success': False,
                    'error': True,
                    'message': 'Invalid test case format',
                    'expected': ''
                })
                continue

            input_data = test_case.get('input', '').replace('\r', '')
            expected_output = test_case.get('expected_test_cases', '').replace('\r', '')

            run_command = ['docker', 'exec', '-i', container_name]
            if self.submission.language.lower() == 'cpp':
                run_command.append('/code/main')
            else:
                run_command.extend(['python3', '/code/main.py'])

            try:
                process = await asyncio.create_subprocess_exec(
                    *run_command,
                    stdin=asyncio.subprocess.PIPE,
                    stdout=asyncio.subprocess.PIPE,
                    stderr=asyncio.subprocess.PIPE
                )
                stdout, stderr = await asyncio.wait_for(
                    process.communicate(input=input_data.encode()),
                    timeout=self.timeout
                )

                output = stdout.decode().strip()
                error = output.strip() != expected_output.strip()

                results.append({
                    'test_case': test_case,
                    'output': output,
                    'success': not error,
                    'error': error,
                    'expected': expected_output
                })

            except asyncio.TimeoutError:
                results.append({
                    'test_case': test_case,
                    'output': '',
                    'success': False,
                    'error': True,
                    'message': 'Timeout Error',
                    'expected': expected_output
                })
            except Exception as e:
                results.append({
                    'test_case': test_case,
                    'output': '',
                    'success': False,
                    'error': True,
                    'message': f'Execution Error: {str(e)}',
                    'expected': expected_output
                })

        return results

    async def _cleanup_container(self, container_name):
        try:
            await asyncio.create_subprocess_exec(
                'docker', 'rm', '-f', container_name,
                stdout=asyncio.subprocess.DEVNULL,
                stderr=asyncio.subprocess.DEVNULL
            )
        except Exception as e:
            logger.error(f"Error removing container: {str(e)}")

    def _create_error_response(self, message):
        return {
            'message': message,
            'error': True,
            'success': False,
            'output_value': '',
            'input': '',
            'expected_output': ''
        }
