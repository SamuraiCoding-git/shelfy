import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';

// API Service for Tags
const apiService = {
    getTags: async () => {
        try {
            const response = await axios.post(
                'https://2ff1-192-36-61-126.ngrok-free.app/api/tags/fetch-all',
                { userInitData: window.Telegram.WebApp.initData },
                {
                    headers: {
                        'ngrok-skip-browser-warning': 'true',
                        'Content-Type': 'application/json'
                    }
                }
            );
            return response.data.tags || [];
        } catch (error) {
            console.error('Error fetching tags:', error);
            return [];
        }
    },
    addTag: async (tag) => {
        try {
            const response = await axios.post(
                'https://2ff1-192-36-61-126.ngrok-free.app/api/tags',
                {
                    userInitData: window.Telegram.WebApp.initData,
                    tagData: tag
                },
                {
                    headers: {
                        'ngrok-skip-browser-warning': 'true',
                        'Content-Type': 'application/json'
                    }
                }
            );
            return response.data.tag;
        } catch (error) {
            console.error('Error adding tag:', error);
            return null;
        }
    },
    updateTag: async (tagId, updatedTag) => {
        try {
            const response = await axios.post(
                `https://2ff1-192-36-61-126.ngrok-free.app/api/tags/update`,
                {
                    tagId: tagId,
                    tagData: updatedTag,
                    userInitData: window.Telegram.WebApp.initData
                },
                {
                    headers: {
                        'ngrok-skip-browser-warning': 'true',
                        'Content-Type': 'application/json'
                    }
                }
            );
            return response.data.updated_tag;
        } catch (error) {
            console.error('Error updating tag:', error);
            return null;
        }
    },
    deleteTag: async (tagId) => {
        try {
            const response = await axios.post(
                `https://2ff1-192-36-61-126.ngrok-free.app/api/tags/delete`,
                {
                    tagId: tagId,
                    userInitData: window.Telegram.WebApp.initData
                },
                {
                    headers: {
                        'ngrok-skip-browser-warning': 'true',
                        'Content-Type': 'application/json'
                    }
                }
            );
            return response.data;
        } catch (error) {
            console.error('Error deleting tag:', error);
            return null;
        }
    }
};

// Create Context
const TagsContext = createContext();

// TagsProvider Component
export const TagsProvider = ({ children }) => {
    const [tags, setTags] = useState([]);
    const [selectedTags, setSelectedTags] = useState([]);

    // Load initial tags
    useEffect(() => {
        const loadInitialTags = async () => {
            try {
                const tags = await apiService.getTags();
                setTags(tags || []);
            } catch (error) {
                setTags([]);
            }
        };
        loadInitialTags();
    }, []);

    // Add a new tag
    const addTag = async (tag) => {
        const createdTag = await apiService.addTag(tag);
        if (createdTag) {
            setTags(prevTags => [...prevTags, createdTag]);
        }
    };

    // Update a tag
    const updateTag = async (tagId, updatedTag) => {
        const updated = await apiService.updateTag(tagId, updatedTag);
        if (updated) {
            setTags(prevTags => prevTags.map(tag => tag.tag_id === tagId ? updated : tag));
        }
    };

    // Delete a tag
    const deleteTag = async (tagId) => {
        const result = await apiService.deleteTag(tagId);
        if (result) {
            setTags(prevTags => prevTags.filter(tag => tag.tag_id !== tagId));
            setSelectedTags(prevSelected => prevSelected.filter(tag => tag.tag_id !== tagId));
        }
    };

    // Delete selected tags
    const deleteSelectedTags = async () => {
        const tagIds = selectedTags.map(tag => tag.tag_id);
        const results = await Promise.all(tagIds.map(tagId => apiService.deleteTag(tagId)));
        if (results.every(result => result !== null)) {
            setTags(prevTags => prevTags.filter(tag => !tagIds.includes(tag.tag_id)));
            setSelectedTags([]);
        }
    };

    // Select or deselect a tag
    const selectTag = (tag) => {
        setTags(prevTags => prevTags.map(t =>
            t.tag_id === tag.tag_id ? { ...t, checked: !t.checked } : t
        ));
        setSelectedTags(prevSelected => {
            const isSelected = prevSelected.some(t => t.tag_id === tag.tag_id);
            if (isSelected) {
                return prevSelected.filter(t => t.tag_id !== tag.tag_id);
            } else {
                return [...prevSelected, { ...tag, checked: true }];
            }
        });
    };

    // Reset selected tags
    const resetSelectedTags = () => {
        setTags(prevTags => prevTags.map(tag => ({ ...tag, checked: false })));
        setSelectedTags([]);
    };

    // Remove a single tag from selectedTags
    const removeSelectedTag = (tagId) => {
        setSelectedTags(prevSelected => prevSelected.filter(tag => tag.tag_id !== tagId));
        setTags(prevTags => prevTags.map(tag =>
            tag.tag_id === tagId ? { ...tag, checked: false } : tag
        ));
    };

    // Get count of all tags
    const getTagsCount = () => tags.length;

    return (
        <TagsContext.Provider
            value={{
                tags,
                selectedTags,
                addTag,
                updateTag,
                deleteTag,
                deleteSelectedTags,
                selectTag,
                resetSelectedTags,
                getTagsCount,
                removeSelectedTag,
            }}
        >
            {children}
        </TagsContext.Provider>
    );
};

// Custom Hook for Consuming Context
export const useTags = () => useContext(TagsContext);

