export interface AIVendorPayload {
  prompt?: string;
  text: string;
  api_key: string;
  model?: string;
}

export interface AIVendor {
  ask(input: AIVendorPayload): Promise<string>;
}
