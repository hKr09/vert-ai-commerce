// app/routes/index.jsx
import { useFetcher } from "@remix-run/react";
import { 
  Page, 
  Layout, 
  Card, 
  TextField, 
  Button, 
  Spinner, 
  Banner,
  TextContainer,
  Stack
} from "@shopify/polaris";
import { useState, useEffect } from "react";

export default function Index() {
  const fetcher = useFetcher();
  const [prompt, setPrompt] = useState("");
  
  // Extract data and state from fetcher
  const isSubmitting = fetcher.state === "submitting";
  const data = fetcher.data;
  const error = fetcher.data?.error;

  // Handle form submission
  const handleGenerate = () => {
    if (!prompt.trim()) {
      return; // Don't submit empty prompts
    }
    
    fetcher.submit(
      { prompt: prompt.trim() }, 
      { method: "post", action: "/api/generate" }
    );
  };

  // Clear form after successful generation
  useEffect(() => {
    if (data?.success && data?.generatedText) {
      setPrompt(""); // Clear the input after successful generation
    }
  }, [data]);

  return (
    <Page title="AI Content Generator">
      <Layout>
        <Layout.Section>
          {/* Main form card */}
          <Card sectioned>
            <Stack vertical spacing="loose">
              <TextContainer>
                <p>
                  Generate engaging content for your Shopify store using AI. 
                  Enter a product description or marketing idea below.
                </p>
              </TextContainer>
              
              {/* Product description input */}
              <TextField
                label="Product or post description"
                value={prompt}
                onChange={setPrompt}
                placeholder="E.g., A premium wireless Bluetooth headphone with noise cancellation, perfect for music lovers and professionals"
                multiline={4}
                disabled={isSubmitting}
                helpText="Describe your product, promotion, or content idea in detail"
              />
              
              {/* Submit button with loading state */}
              <div style={{ marginTop: 8 }}>
                <Button 
                  primary 
                  onClick={handleGenerate}
                  disabled={isSubmitting || !prompt.trim()}
                  loading={isSubmitting}
                >
                  {isSubmitting ? "Generating..." : "Generate AI Content"}
                </Button>
              </div>
            </Stack>
          </Card>
        </Layout.Section>

        {/* Loading state */}
        {isSubmitting && (
          <Layout.Section>
            <Card sectioned>
              <Stack alignment="center" spacing="tight">
                <Spinner size="small" />
                <p>Generating your content with AI...</p>
              </Stack>
            </Card>
          </Layout.Section>
        )}

        {/* Error display */}
        {error && (
          <Layout.Section>
            <Banner status="critical">
              <p>Error: {error}</p>
            </Banner>
          </Layout.Section>
        )}

        {/* Success response display */}
        {data?.success && data?.generatedText && (
          <Layout.Section>
            <Card sectioned>
              <Stack vertical spacing="loose">
                <TextContainer>
                  <h3>Generated Content</h3>
                  <p>Here's your AI-generated content:</p>
                </TextContainer>
                
                <Card sectioned>
                  <div style={{ 
                    whiteSpace: "pre-wrap", 
                    lineHeight: "1.6",
                    fontSize: "14px"
                  }}>
                    {data.generatedText}
                  </div>
                </Card>
                
                <Button 
                  onClick={() => {
                    navigator.clipboard.writeText(data.generatedText);
                  }}
                  size="slim"
                >
                  Copy to Clipboard
                </Button>
              </Stack>
            </Card>
          </Layout.Section>
        )}
      </Layout>
    </Page>
  );
}
