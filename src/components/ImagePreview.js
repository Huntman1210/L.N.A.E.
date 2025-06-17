import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { saveAs } from 'file-saver';
import useImageStore from '../stores/imageStore.js';

const PreviewContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  overflow: hidden;
`;

const PreviewHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`;

const PreviewTitle = styled.h3`
  margin: 0;
  font-size: 1.2rem;
  color: white;
`;

const ViewControls = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const ViewButton = styled(motion.button)`
  background: ${props => props.active ? 'rgba(74, 222, 128, 0.2)' : 'rgba(255, 255, 255, 0.1)'};
  border: 1px solid ${props => props.active ? '#4ade80' : 'rgba(255, 255, 255, 0.2)'};
  border-radius: 6px;
  color: white;
  padding: 0.4rem 0.8rem;
  cursor: pointer;
  font-size: 0.8rem;
  
  &:hover {
    background: rgba(74, 222, 128, 0.1);
  }
`;

const PreviewContent = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: rgba(255, 255, 255, 0.6);
  text-align: center;
`;

const EmptyIcon = styled.div`
  font-size: 4rem;
  margin-bottom: 1rem;
  opacity: 0.5;
`;

const EmptyText = styled.div`
  font-size: 1.1rem;
  margin-bottom: 0.5rem;
`;

const EmptySubtext = styled.div`
  font-size: 0.9rem;
  opacity: 0.8;
`;

const ImageGrid = styled.div`
  display: grid;
  grid-template-columns: ${props => {
    switch (props.viewMode) {
      case 'list': return '1fr';
      case 'gallery': return 'repeat(auto-fill, minmax(200px, 1fr))';
      default: return 'repeat(auto-fill, minmax(150px, 1fr))';
    }
  }};
  gap: 1rem;
`;

const ImageCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  position: relative;
  
  &:hover {
    background: rgba(255, 255, 255, 0.15);
  }
`;

const ImageContainer = styled.div`
  position: relative;
  aspect-ratio: 1;
  overflow: hidden;
`;

const Image = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
  
  ${ImageCard}:hover & {
    transform: scale(1.05);
  }
`;

const ImageOverlay = styled(motion.div)`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
`;

const ActionButton = styled(motion.button)`
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 8px;
  color: white;
  padding: 0.5rem;
  cursor: pointer;
  font-size: 1.2rem;
  
  &:hover {
    background: rgba(255, 255, 255, 0.3);
  }
`;

const ImageInfo = styled.div`
  padding: 1rem;
  ${props => props.viewMode === 'list' && `
    display: flex;
    justify-content: space-between;
    align-items: center;
  `}
`;

const ImagePrompt = styled.div`
  font-size: 0.9rem;
  color: white;
  margin-bottom: 0.5rem;
  line-height: 1.4;
  ${props => props.viewMode === 'list' && `
    flex: 1;
    margin-bottom: 0;
    margin-right: 1rem;
  `}
`;

const ImageMeta = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.7);
  ${props => props.viewMode === 'list' && `
    flex-direction: column;
    align-items: flex-end;
    gap: 0.25rem;
  `}
`;

const ImageBadge = styled.span`
  background: ${props => {
    switch (props.type) {
      case 'dall-e-3': return 'rgba(16, 185, 129, 0.2)';
      case 'dall-e-2': return 'rgba(59, 130, 246, 0.2)';
      case 'pollinations': return 'rgba(244, 114, 182, 0.2)'; // Pink
      case 'craiyon': return 'rgba(234, 179, 8, 0.2)'; // Yellow
      case 'variation': return 'rgba(168, 85, 247, 0.2)'; // Purple
      default: return 'rgba(107, 114, 128, 0.2)';
    }
  }};
  color: ${props => {
    switch (props.type) {
      case 'dall-e-3': return '#10b981'; // Green
      case 'dall-e-2': return '#3b82f6'; // Blue
      case 'pollinations': return '#ec4899'; // Pink
      case 'craiyon': return '#ca8a04'; // Yellow
      case 'variation': return '#a855f7'; // Purple
      default: return '#6b7280'; // Gray
    }
  }};
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
  font-size: 0.7rem;
  font-weight: 500;
`;

const Modal = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 2rem;
`;

const ModalContent = styled(motion.div)`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  padding: 2rem;
  max-width: 90vw;
  max-height: 90vh;
  overflow: auto;
  color: white;
`;

const ModalImage = styled.img`
  max-width: 100%;
  max-height: 60vh;
  border-radius: 12px;
  margin-bottom: 1rem;
`;

const ModalActions = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
  flex-wrap: wrap;
`;

const ModalButton = styled(motion.button)`
  background: ${props => props.primary ? 'linear-gradient(135deg, #4ade80, #06b6d4)' : 'rgba(255, 255, 255, 0.1)'};
  border: 1px solid ${props => props.primary ? 'transparent' : 'rgba(255, 255, 255, 0.2)'};
  border-radius: 8px;
  color: white;
  padding: 0.6rem 1.2rem;
  cursor: pointer;
  font-size: 0.9rem;
  
  &:hover {
    background: ${props => props.primary ? 'linear-gradient(135deg, #22c55e, #0891b2)' : 'rgba(255, 255, 255, 0.2)'};
  }
`;

function ImagePreview() {
  const {
    generatedImages,
    selectedImage,
    viewMode,
    isGenerating,
    setSelectedImage,
    setViewMode,
    generateVariations,
    removeImage,
    loadHistory
  } = useImageStore();

  const [hoveredImage, setHoveredImage] = useState(null);

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  const handleImageClick = (image) => {
    setSelectedImage(image);
  };

  const handleDownload = async (image) => {
    try {
      const response = await fetch(image.url);
      const blob = await response.blob();
      const filename = `ai-image-${image.id || Date.now()}.png`;
      saveAs(blob, filename);
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  const handleCreateVariations = (image) => {
    generateVariations(image.url, 2);
    setSelectedImage(null);
  };

  const handleRemove = (image) => {
    removeImage(image.id);
    if (selectedImage?.id === image.id) {
      setSelectedImage(null);
    }
  };

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleString();
  };

  const getProviderBadgeType = (provider) => {
    if (provider?.includes('dall-e-3')) return 'dall-e-3';
    if (provider?.includes('dall-e-2')) return 'dall-e-2';
    if (provider?.includes('pollinations')) return 'pollinations';
    if (provider?.includes('craiyon')) return 'craiyon';
    return 'unknown';
  };

  return (
    <PreviewContainer>
      <PreviewHeader>
        <PreviewTitle>Generated Images ({generatedImages.length})</PreviewTitle>
        <ViewControls>
          <ViewButton
            active={viewMode === 'grid'}
            onClick={() => setViewMode('grid')}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            ⊞ Grid
          </ViewButton>
          <ViewButton
            active={viewMode === 'list'}
            onClick={() => setViewMode('list')}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            ☰ List
          </ViewButton>
        </ViewControls>
      </PreviewHeader>

      <PreviewContent>
        {generatedImages.length === 0 && !isGenerating ? (
          <EmptyState>
            <EmptyIcon>🎨</EmptyIcon>
            <EmptyText>No images generated yet</EmptyText>
            <EmptySubtext>Create your first AI-generated image using the prompt editor</EmptySubtext>
          </EmptyState>
        ) : (
          <ImageGrid viewMode={viewMode}>
            <AnimatePresence>
              {generatedImages.map((image, index) => (
                <ImageCard
                  key={image.id}
                  onClick={() => handleImageClick(image)}
                  onHoverStart={() => setHoveredImage(image.id)}
                  onHoverEnd={() => setHoveredImage(null)}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  layout
                >
                  <ImageContainer>
                    <Image
                      src={image.url}
                      alt={image.prompt}
                      loading="lazy"
                    />
                    <AnimatePresence>
                      {hoveredImage === image.id && (
                        <ImageOverlay
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                        >
                          <ActionButton
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDownload(image);
                            }}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            title="Download"
                          >
                            ⬇️
                          </ActionButton>
                          <ActionButton
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCreateVariations(image);
                            }}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            title="Create Variations"
                          >
                            🔄
                          </ActionButton>
                          <ActionButton
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemove(image);
                            }}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            title="Remove"
                          >
                            🗑️
                          </ActionButton>
                        </ImageOverlay>
                      )}
                    </AnimatePresence>
                  </ImageContainer>
                  
                  <ImageInfo viewMode={viewMode}>
                    <ImagePrompt viewMode={viewMode}>
                      {image.enhancedPrompt || image.prompt}
                    </ImagePrompt>
                    <ImageMeta viewMode={viewMode}>
                      <ImageBadge type={image.isVariation ? 'variation' : getProviderBadgeType(image.provider)}>
                        {image.isVariation ? 'Variation' : image.provider || 'AI Generated'}
                      </ImageBadge>
                      <span>{formatTimestamp(image.timestamp)}</span>
                    </ImageMeta>
                  </ImageInfo>
                </ImageCard>
              ))}
            </AnimatePresence>
          </ImageGrid>
        )}
      </PreviewContent>

      {/* Modal for selected image */}
      <AnimatePresence>
        {selectedImage && (
          <Modal
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImage(null)}
          >
            <ModalContent
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <ModalImage
                src={selectedImage.url}
                alt={selectedImage.prompt}
              />
              <div>
                <h4 style={{ margin: '0 0 0.5rem 0', color: '#4ade80' }}>
                  Generated Image Details
                </h4>
                <p style={{ margin: '0 0 1rem 0', lineHeight: 1.5 }}>
                  <strong>Prompt:</strong> {selectedImage.enhancedPrompt || selectedImage.prompt}
                </p>
                <div style={{ 
                  display: 'flex', 
                  gap: '1rem', 
                  fontSize: '0.9rem',
                  marginBottom: '1rem',
                  flexWrap: 'wrap'
                }}>
                  <span>
                    <strong>Provider:</strong> {selectedImage.provider || 'Unknown'}
                  </span>
                  <span>
                    <strong>Created:</strong> {formatTimestamp(selectedImage.timestamp)}
                  </span>
                  {selectedImage.options?.size && (
                    <span>
                      <strong>Size:</strong> {selectedImage.options.size}
                    </span>
                  )}
                </div>
              </div>
              
              <ModalActions>
                <ModalButton
                  primary
                  onClick={() => handleDownload(selectedImage)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  ⬇️ Download
                </ModalButton>
                <ModalButton
                  onClick={() => handleCreateVariations(selectedImage)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  🔄 Create Variations
                </ModalButton>
                <ModalButton
                  onClick={() => handleRemove(selectedImage)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  🗑️ Remove
                </ModalButton>
                <ModalButton
                  onClick={() => setSelectedImage(null)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  ✕ Close
                </ModalButton>
              </ModalActions>
            </ModalContent>
          </Modal>
        )}
      </AnimatePresence>
    </PreviewContainer>
  );
}

export default ImagePreview;
