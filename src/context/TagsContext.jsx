import React, { createContext, useContext, useReducer, useEffect } from 'react';
import axios from 'axios';

// Action types
const ADD_TAG = 'ADD_TAG';
const UPDATE_TAG = 'UPDATE_TAG';
const DELETE_TAG = 'DELETE_TAG';
const DELETE_SELECTED_TAGS = 'DELETE_SELECTED_TAGS';
const SELECT_TAG = 'SELECT_TAG';
const RESET_SELECTED_TAGS = 'RESET_SELECTED_TAGS';
const SET_SELECTED_TAGS = 'SET_SELECTED_TAGS';
const SET_TAGS_FROM_API = 'SET_TAGS_FROM_API'; // New action type for setting tags from API

// Initial state
const initialState = {
    tags: [],
    selectedTags: [],
};

// API Service for Tags
const apiService = {
    getTags: async (userInitData) => {
        try {
            // Send the userInitData (which includes the user_id) along with the request
            const response = await axios.post('/tags/fetch-all', { user: userInitData });
            return response.data.tags || []; // Ensure the correct response format
        } catch (error) {
            console.error('Error fetching tags:', error);
            return []; // Return empty array if there's an error
        }
    },
    addTag: async (tag) => {
        try {
            const response = await axios.post('/tags', { tagData: tag });
            return response.data.tag; // Assuming API returns the newly created tag
        } catch (error) {
            console.error('Error adding tag:', error);
            return null; // Return null in case of error
        }
    },
    updateTag: async (tagId, updatedTag) => {
        try {
            const response = await axios.post(`/tags/update`, { tagId, tagData: updatedTag });
            return response.data.updated_tag; // Assuming API returns the updated tag
        } catch (error) {
            console.error('Error updating tag:', error);
            return null; // Return null in case of error
        }
    },
    deleteTag: async (tagId) => {
        try {
            const response = await axios.post(`/tags/delete`, { tagId });
            return response.data; // Assuming API returns confirmation of deletion
        } catch (error) {
            console.error('Error deleting tag:', error);
            return null; // Return null in case of error
        }
    }
};


// Reducer function to handle state changes
const tagsReducer = (state, action) => {
    switch (action.type) {
        case ADD_TAG:
            return {
                ...state,
                tags: [...state.tags, action.payload],
            };

        case UPDATE_TAG:
            return {
                ...state,
                tags: state.tags.map((tag) =>
                    tag.id === action.payload.id ? action.payload : tag
                ),
            };

        case DELETE_TAG:
            return {
                ...state,
                tags: state.tags.filter((tag) => tag.id !== action.payload),
            };

        case DELETE_SELECTED_TAGS:
            return {
                ...state,
                tags: state.tags.filter(tag => !action.payload.some(t => t.id === tag.id)),
                selectedTags: [],
            };

        case SELECT_TAG:
            return {
                ...state,
                tags: state.tags.map(tag =>
                    tag.id === action.payload.id ? { ...tag, checked: !tag.checked } : tag
                ),
                selectedTags: state.tags.filter(tag => tag.checked),
            };

        case RESET_SELECTED_TAGS:
            return {
                ...state,
                tags: state.tags.map((tag) => ({ ...tag, checked: false })),
                selectedTags: [],
            };

        case SET_SELECTED_TAGS:
            return {
                ...state,
                selectedTags: action.payload,
            };

        case SET_TAGS_FROM_API:
            return {
                ...state,
                tags: action.payload.map(tag => ({ ...tag, checked: false })),
            };

        default:
            return state;
    }
};

// Create the context for tags state
const TagsContext = createContext(null);

// TagsProvider component to provide global tags state
export const TagsProvider = ({ children }) => {
    const [state, dispatch] = useReducer(tagsReducer, initialState);

    // Action creators for dispatching actions
    const addTag = async (tag) => {
        const createdTag = await apiService.addTag(tag);
        if (createdTag) {
            dispatch({ type: ADD_TAG, payload: createdTag });
        }
    };

    const updateTag = async (tagId, updatedTag) => {
        const updated = await apiService.updateTag(tagId, updatedTag);
        if (updated) {
            dispatch({ type: UPDATE_TAG, payload: updated });
        }
    };

    const deleteTag = async (tagId) => {
        const result = await apiService.deleteTag(tagId);
        if (result) {
            dispatch({ type: DELETE_TAG, payload: tagId });
        }
    };

    const deleteSelectedTags = async () => {
        const tagIds = state.selectedTags.map(tag => tag.id);
        const result = await Promise.all(tagIds.map(tagId => apiService.deleteTag(tagId)));
        if (result.every(res => res !== null)) {
            dispatch({ type: DELETE_SELECTED_TAGS, payload: state.selectedTags });
        }
    };

    const selectTag = (tag) => {
        dispatch({ type: SELECT_TAG, payload: tag });
    };

    const resetSelectedTags = () => {
        dispatch({ type: RESET_SELECTED_TAGS });
    };

    const setSelectedTags = (tags) => {
        dispatch({ type: SET_SELECTED_TAGS, payload: tags });
    };

    // Fetch initial tags from API on component mount
    useEffect(() => {
        const loadTags = async () => {
            const tags = await apiService.getTags();
            dispatch({ type: SET_TAGS_FROM_API, payload: tags });
        };
        loadTags();
    }, []); // This runs once on mount

    return (
        <TagsContext.Provider
            value={{
                tags: state.tags,
                selectedTags: state.selectedTags,
                addTag,
                updateTag,
                deleteTag,
                deleteSelectedTags,
                selectTag,
                resetSelectedTags,
                setSelectedTags,
            }}
        >
            {children}
        </TagsContext.Provider>
    );
};

// Custom hook to use tags context
export const useTags = () => useContext(TagsContext);
