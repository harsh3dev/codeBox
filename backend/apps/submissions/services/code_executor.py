import os
import subprocess
import tempfile
import shutil

class CodeExecutor:
    def __init__(self, submission, test_cases):
        self.submission = submission
        self.test_cases = test_cases
        self.temp_dir = tempfile.mkdtemp()

    def execute(self):
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

        return handler()

    def _handle_python(self):
        file_path = os.path.join(self.temp_dir, 'main.py')
        with open(file_path, 'w') as f:
            f.write(self.submission.code)

        return self._run_tests('python')

    def _handle_cpp(self):
        # Create the C++ file in the same directory for Docker compilation
        file_path = os.path.join(self.temp_dir, 'main.cpp')
        with open(file_path, 'w') as f:
            f.write(self.submission.code)

        # Compile the C++ code using Docker with g++
        compile_command = [
            'docker', 'run', '--rm',
            '-v', f'{self.temp_dir}:/code',
            'gcc:latest', 'g++', '/code/main.cpp', '-o', '/code/main'
        ]
        
        compile_result = subprocess.run(
            compile_command, capture_output=True, text=True
        )

        if compile_result.returncode != 0:
            return {
                'message': f'Compilation Error: {compile_result.stderr}',
                'error': True,
                'success': False,
                'output_value': '',
                'input': '',
                'expected_output': ''
            }

        return self._run_tests('cpp')

    def _run_tests(self, language):
        docker_commands = {
            'python': ['python3', 'main.py'],
            'cpp': ['./main']
        }

        all_tests_passed = True
        results = []

        for test_case in self.test_cases:
            input_data = test_case.get('input', '')
            expected_output = test_case.get('expected_output', '')

            input_path = os.path.join(self.temp_dir, 'input.txt')
            with open(input_path, 'w') as f:
                f.write(input_data.replace('\r', ''))

            # Run the program inside the Docker container
            process = subprocess.run(
                [
                    'docker', 'run', '--rm', '-i',
                    '-v', f'{self.temp_dir}:/usr/src/app',
                    '-w', '/usr/src/app',
                    f'coderunner_{language}', 
                    *docker_commands[language]
                ],
                input=input_data.encode(),
                capture_output=True,
                text=True
            )

            output = process.stdout.strip()

            if output != expected_output.strip():
                all_tests_passed = False
                results.append({
                    'input': input_data,
                    'output_value': output,
                    'expected_output': expected_output,
                    'error': True
                })
            else:
                results.append({
                    'input': input_data,
                    'output_value': output,
                    'expected_output': expected_output,
                    'error': False
                })

        # Clean up the temporary directory
        shutil.rmtree(self.temp_dir)

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
