import React, { useState } from "react";
import {
  Page,
  Layout,
  Card,
  Text,
  Button,
  TextField,
  Select,
  Stack,
  Thumbnail,
  Banner,
  Divider,
  Icon,
} from "@shopify/polaris";
import { ImageIcon, CalendarIcon } from "@shopify/polaris-icons";

export default function Index() {
  // State variables
  const [credits, setCredits] = useState(42);
  const [prompt, setPrompt] = useState("");
  const [description, setDescription] = useState("");
  const [caption, setCaption] = useState("");
  const [hashtags, setHashtags] = useState("");
  const [previewImage, setPreviewImage] = useState(null);
  const [postType, setPostType] = useState("instagram");
  const [tone, setTone] = useState("professional");

  // Dropdown options
  const postTypeOptions = [
    { label: "Instagram Post", value: "instagram" },
    { label: "Facebook Post", value: "facebook" },
    { label: "Email Campaign", value: "email" },
  ];

  const toneOptions = [
    { label: "Professional", value: "professional" },
    { label: "Casual", value: "casual" },
    { label: "Playful", value: "playful" },
    { label: "Inspirational", value: "inspirational" },
  ];

  // File upload handler
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.size <= 10 * 1024 * 1024) {
      setPreviewImage(URL.createObjectURL(file));
    } else {
      alert("File is too large! Max 10MB.");
    }
  };

  // Generate post simulation
  const handleGenerate = () => {
    setCaption(
      "✨ Introducing our latest product — designed for your comfort and style. Limited stock available! 💼"
    );
    setHashtags("#AIContent #ShopifyStore #EcommerceGrowth");
    setCredits((prev) => Math.max(prev - 1, 0));
  };

  return (
    <Page title="AI Social Post Studio">
      <Layout>
        {/* Left Column - Agent Task */}
        <Layout.Section variant="oneHalf">
          {/* Credits Banner */}
          <Banner title={`Credits Remaining: ${credits}`} status="info">
            Keep an eye on your balance — top up before you run out.
          </Banner>

          {/* Image Upload */}
          <Card sectioned title="Upload Image (Optional)">
            <Stack vertical spacing="tight">
              <input type="file" accept="image/*" onChange={handleImageUpload} />
              <Text variant="bodyMd">Max file size: 10MB</Text>
            </Stack>
          </Card>

          {/* Prompt Input */}
          <Card sectioned title="Image Prompt">
            <TextField
              value={prompt}
              onChange={setPrompt}
              placeholder="Describe the image you want the AI to create..."
              multiline={3}
            />
          </Card>

          {/* Optional Description */}
          <Card sectioned title="Description (Optional)">
            <TextField
              value={description}
              onChange={setDescription}
              placeholder="Add details about your product or promotion..."
              multiline={2}
            />
          </Card>

          {/* Post Type & Tone */}
          <Card sectioned>
            <Stack spacing="tight">
              <Select
                label="Post Type"
                options={postTypeOptions}
                onChange={setPostType}
                value={postType}
              />
              <Select
                label="Tone & Style"
                options={toneOptions}
                onChange={setTone}
                value={tone}
              />
            </Stack>
          </Card>

          {/* Generate Button */}
          <Card sectioned>
            <Button
              primary
              fullWidth
              onClick={handleGenerate}
              disabled={credits <= 0}
            >
              Generate Post
            </Button>
          </Card>
        </Layout.Section>

        {/* Right Column - Live Preview */}
        <Layout.Section variant="oneHalf">
          <Card title="Live Preview" sectioned>
            <Stack vertical spacing="loose" alignment="center">
              {/* Image Preview */}
              {previewImage ? (
                <Thumbnail
                  source={previewImage}
                  alt="Generated Preview"
                  size="large"
                />
              ) : (
                <div
                  style={{
                    width: "100%",
                    height: "300px",
                    border: "1px dashed #ccc",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "#f9fafb",
                  }}
                >
                  <Icon source={ImageIcon} tone="subdued" />
                </div>
              )}

              {/* Caption Preview */}
              {caption && (
                <Card subdued sectioned>
                  <Text variant="headingMd">Caption</Text>
                  <Text>{caption}</Text>
                </Card>
              )}

              {/* Hashtag Preview */}
              {hashtags && (
                <Card subdued sectioned>
                  <Text variant="headingMd">Hashtags</Text>
                  <Text>{hashtags}</Text>
                </Card>
              )}

              {/* Quick Actions */}
              {caption && (
                <Stack spacing="tight">
                  <Button onClick={() => navigator.clipboard.writeText(caption)}>
                    Copy Caption
                  </Button>
                  <Button
                    onClick={() => {
                      if (previewImage) {
                        const link = document.createElement("a");
                        link.href = previewImage;
                        link.download = "generated-post.jpg";
                        link.click();
                      }
                    }}
                  >
                    Download Image
                  </Button>
                  <Button icon={CalendarIcon}>Schedule Post</Button>
                </Stack>
              )}
            </Stack>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
