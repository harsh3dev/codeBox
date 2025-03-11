export interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  isLoading?: boolean;
}

export interface Problem {
  title: string;
  description: string;
  examples: Array<{
    input: string;
    output: string;
    explanation?: string;
  }>;
}

export interface TestCase {
  id: number;
  problem: number; 
  input_data: string; 
  expected_output: string; 
  is_sample: boolean; 
  explanation: string; 
  order: number;
}
