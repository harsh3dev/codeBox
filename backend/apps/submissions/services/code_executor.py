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
            'java': self._handle_java,
            'python': self._handle_python,
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

    def _handle_java(self):
        file_path = os.path.join(self.temp_dir, 'Main.java')
        with open(file_path, 'w') as f:
            f.write(self.submission.code)
        
        compile_result = subprocess.run([
            'docker', 'run', '--rm',
            '-v', f'{self.temp_dir}:/code',
            'openjdk:latest',  
            'javac', 'Main.java'
        ], capture_output=True, text=True)
        
        if compile_result.returncode != 0:
            return {
                'message': f'Compilation Error: {compile_result.stderr}',
                'error': True,
                'success': False,
                'output_value': '',
                'input': '',
                'expected_output': ''
            }
        
        return self._run_tests('java')

    def _handle_python(self):
        file_path = os.path.join(self.temp_dir, 'main.py')
        with open(file_path, 'w') as f:
            f.write(self.submission.code)
        
        return self._run_tests('python')

    def _handle_cpp(self):
        file_path = os.path.join(self.temp_dir, 'main.cpp')
        with open(file_path, 'w') as f:
            f.write(self.submission.code)
        
        compile_result = subprocess.run([
            'docker', 'run', '--rm',
            '-v', f'{self.temp_dir}:/code',
            'gcc:latest',  
            'g++', 'main.cpp', '-o', 'main'
        ], capture_output=True, text=True)
        
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
            'java': ['java', 'Main'],
            'python': ['python3', 'main.py'],
            'cpp': ['./main']
        }

        all_tests_passed = True
        results = []

        for test_case in self.test_cases:
            input_path = os.path.join(self.temp_dir, 'input.txt')
            with open(input_path, 'w') as f:
                f.write(test_case.input.replace('\r', ''))
            
            cmd = docker_commands[language]
            process = subprocess.run([
                'docker', 'run', '--rm', '-i',
                '-v', f'{self.temp_dir}:/code',
                f'coderunner_{language}',
                *cmd
            ], input=test_case.input.encode(), capture_output=True, text=True)
            
            output = process.stdout.strip()
            expected = test_case.expected_output.strip()

            if output != expected:
                all_tests_passed = False
                results.append({
                    'input': test_case.input,
                    'output_value': output,
                    'expected_output': expected,
                    'error': True
                })
            else:
                results.append({
                    'input': test_case.input,
                    'output_value': output,
                    'expected_output': expected,
                    'error': False
                })
        
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
