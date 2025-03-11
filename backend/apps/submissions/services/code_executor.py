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
        self._container_pool.add(container_name)

        try:
            source_file = os.path.join(self.base_dir, 'python', 'main.py')
            await self._write_file_async(source_file, self.submission.code)

            # Modified: Keep container running with tail -f /dev/null
            create_command = [
                'docker', 'run',
                '-d',
                '--memory=128m',
                '--cpus=0.5',
                '--network=none',
                '--name', container_name,
                'coderunner_python:latest',
                'sh', '-c', 'tail -f /dev/null'  # Keep container running
            ]
            
            # Check create container success
            process = await asyncio.create_subprocess_exec(
                *create_command,
                stdout=asyncio.subprocess.PIPE,
                stderr=asyncio.subprocess.PIPE
            )
            stdout, stderr = await process.communicate()
            
            if process.returncode != 0:
                return self._create_error_response(f'Container creation failed: {stderr.decode()}')
                
            logger.info(f"container created: {container_name}")
            
            copy_command = [
                'docker', 'cp',
                source_file,
                f'{container_name}:/code/main.py'
            ]
            # Check copy success
            process = await asyncio.create_subprocess_exec(
                *copy_command,
                stdout=asyncio.subprocess.PIPE,
                stderr=asyncio.subprocess.PIPE
            )
            stdout, stderr = await process.communicate()
            
            if process.returncode != 0:
                return self._create_error_response(f'Failed to copy code: {stderr.decode()}')
                
            logger.info(f"code copied: {container_name}")
            
            # Verify container is running before tests
            is_running = await self._check_container_running(container_name)
            if not is_running:
                return self._create_error_response(f'Container stopped unexpectedly before test execution')
            
            results = await self._run_all_tests(container_name)
            
            # Container cleanup moved here - happens only once AFTER all tests
            await self._cleanup_container(container_name)
            
            return results

        except Exception as e:
            # Make sure we clean up the container if an exception occurs
            await self._cleanup_container(container_name)
            logger.error(f"Error in Python handling: {e}")
            return self._create_error_response(f'Error: {str(e)}')
        finally:
            # In case cleanup fails for some reason
            if container_name in self._container_pool:
                self._container_pool.remove(container_name)

    async def _handle_cpp(self):
        container_name = f'coderunner_cpp_{uuid.uuid4().hex}'
        self._container_pool.add(container_name)

        try:
            source_file = os.path.join(self.base_dir, 'cpp', 'main.cpp')
            await self._write_file_async(source_file, self.submission.code)

            # Modified: Keep container running with tail -f /dev/null
            create_command = [
                'docker', 'run',
                '-d',
                '--memory=128m',
                '--cpus=0.5',
                '--network=none',
                '--name', container_name,
                'coderunner_cpp:latest',
                'sh', '-c', 'tail -f /dev/null'  # Keep container running
            ]
            
            process = await asyncio.create_subprocess_exec(
                *create_command,
                stdout=asyncio.subprocess.PIPE,
                stderr=asyncio.subprocess.PIPE
            )
            stdout, stderr = await process.communicate()
            
            if process.returncode != 0:
                return self._create_error_response(f'Container creation failed: {stderr.decode()}')

            copy_command = [
                'docker', 'cp',
                source_file,
                f'{container_name}:/code/main.cpp'
            ]
            process = await asyncio.create_subprocess_exec(
                *copy_command,
                stdout=asyncio.subprocess.PIPE,
                stderr=asyncio.subprocess.PIPE
            )
            stdout, stderr = await process.communicate()
            
            if process.returncode != 0:
                return self._create_error_response(f'Failed to copy code: {stderr.decode()}')

            # Verify container is running before compilation
            is_running = await self._check_container_running(container_name)
            if not is_running:
                return self._create_error_response(f'Container stopped unexpectedly before compilation')

            compile_result = await self._compile_cpp(container_name)
            if compile_result.get('error', False):
                await self._cleanup_container(container_name)
                return compile_result
                
            # Verify container is running before tests
            is_running = await self._check_container_running(container_name)
            if not is_running:
                return self._create_error_response(f'Container stopped unexpectedly after compilation')

            results = await self._run_all_tests(container_name)
            
            # Container cleanup moved here - happens only once AFTER all tests
            await self._cleanup_container(container_name)
            
            return results

        except Exception as e:
            # Make sure we clean up the container if an exception occurs
            await self._cleanup_container(container_name)
            logger.error(f"Error in C++ handling: {e}")
            return self._create_error_response(f'Error: {str(e)}')
        finally:
            # In case cleanup fails for some reason
            if container_name in self._container_pool:
                self._container_pool.remove(container_name)

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
        return await process.communicate()

    async def _check_container_running(self, container_name):
        try:
            inspect_command = [
                'docker', 'container', 'inspect',
                '--format={{.State.Running}}',
                container_name
            ]
            
            process = await asyncio.create_subprocess_exec(
                *inspect_command,
                stdout=asyncio.subprocess.PIPE,
                stderr=asyncio.subprocess.PIPE
            )
            stdout, stderr = await process.communicate()
            
            if process.returncode != 0:
                logger.warning(f"Container inspection failed: {stderr.decode()}")
                return False
                
            return stdout.decode().strip().lower() == 'true'
        except Exception as e:
            logger.error(f"Error checking container status: {e}")
            return False

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
            # Better validation for test cases
            if not isinstance(test_case, dict):
                logger.warning(f"Invalid test case format: {test_case}")
                results.append({
                    'test_case': test_case,
                    'output': '',
                    'success': False,
                    'error': True,
                    'message': 'Invalid test case format',
                    'expected': ''
                })
                continue

            # Safe extraction of test case data
            input_data = test_case.get('input_data', '')
            expected_output = test_case.get('expected_output', '')
            
            logger.info(f"Input data: {input_data}")
            logger.info(f"Output data: {expected_output}")
            
            # Verify container is still running before test
            is_running = await self._check_container_running(container_name)
            if not is_running:
                results.append({
                    'test_case': test_case,
                    'output': '',
                    'success': False,
                    'error': True,
                    'message': f'Container not running before test execution',
                    'expected': expected_output
                })
                continue
            
            # Prepare run command
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
                
                try:
                    stdout, stderr = await asyncio.wait_for(
                        process.communicate(input=input_data.encode() if input_data else None),
                        timeout=self.timeout
                    )

                    if stderr.decode():
                        logger.warning(f"stderr: {stderr.decode()}")
                        results.append({
                            'test_case': test_case,
                            'output': stdout.decode(),
                            'success': False,
                            'error': True,
                            'expected': expected_output,
                            "stderr": stderr.decode()
                        })
                        return results
                except asyncio.TimeoutError:
                    # Try to kill the process if it times out
                    try:
                        process.kill()
                    except:
                        pass
                    results.append({
                        'test_case': test_case,
                        'output': '',
                        'success': False,
                        'error': True,
                        'message': 'Timeout Error',
                        'expected': expected_output
                    })
                    continue

                logger.info(f"stdout: {stdout.decode()}")
                logger.info(f"stderr: {stderr.decode()}")
                output1 = stdout.decode().strip()
                expected1 = expected_output.strip()
                if(output1 != expected1):
                    results.append({
                        'test_case': test_case,
                        'output': stdout.decode(),
                        'success': False,
                        'error': False,
                        'expected': expected_output,
                        "stderr": stderr.decode()
                    })
                    return results
                # Check for container errors
                if process.returncode != 0 or "No such container" in stderr.decode():
                    results.append({
                        'test_case': test_case,
                        'output': '',
                        'success': False,
                        'error': True,
                        'message': f'Container error: {stderr.decode()}',
                        'expected': expected_output
                    })
                    continue

                output = stdout.decode().strip()
                expected = expected_output.strip()
                logger.info(f"output printed {output}")
                logger.info(f"expected printed {expected}")
                success = output == expected

                results.append({
                    'test_case': test_case,
                    'output': output,
                    'success': success,
                    'error': not success,
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
            # First check if the container exists
            check_command = ['docker', 'container', 'inspect', container_name]
            process = await asyncio.create_subprocess_exec(
                *check_command,
                stdout=asyncio.subprocess.PIPE,
                stderr=asyncio.subprocess.PIPE
            )
            _, stderr = await process.communicate()
            
            # Only try to remove if container exists (exit code 0)
            if process.returncode == 0:
                # First stop the container if it's running
                await asyncio.create_subprocess_exec(
                    'docker', 'stop', container_name,
                    stdout=asyncio.subprocess.DEVNULL,
                    stderr=asyncio.subprocess.DEVNULL
                )
                
                # Then remove it
                await asyncio.create_subprocess_exec(
                    'docker', 'rm', '-f', container_name,
                    stdout=asyncio.subprocess.DEVNULL,
                    stderr=asyncio.subprocess.DEVNULL
                )
                logger.info(f"Container removed: {container_name}")
            else:
                logger.warning(f"Container {container_name} not found for cleanup")
                
        except Exception as e:
            logger.error(f"Error removing container: {str(e)}")
        finally:
            # Make sure to remove from the container pool
            if container_name in self._container_pool:
                self._container_pool.remove(container_name)

    def _create_error_response(self, message):
        return {
            'message': message,
            'error': True,
            'success': False,
            'output_value': '',
            'input': '',
            'expected_output': ''
        }