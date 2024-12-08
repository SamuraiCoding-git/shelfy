import React, { createContext, useContext, useReducer } from 'react';
import tags from '../mock-data/exampleTags.json';

// Action types
const ADD_TAG = 'ADD_TAG';
const UPDATE_TAG = 'UPDATE_TAG';
const DELETE_TAG = 'DELETE_TAG';
const DELETE_SELECTED_TAGS = 'DELETE_SELECTED_TAGS';
const SELECT_TAG = 'SELECT_TAG';
const RESET_SELECTED_TAGS = 'RESET_SELECTED_TAGS';
const SET_SELECTED_TAGS = 'SET_SELECTED_TAGS'; // New action type

// Initial state
const initialState = {
    tags: tags.map(tag => ({ ...tag, checked: false })),
    selectedTags: [],
};

// Reducer function to handle state changes
const tagsReducer = (state, action) => {
    switch (action.type) {
        case ADD_TAG:
            const nextId = Math.max(...state.tags.map(tag => tag.id), 0) + 1;
            const newTagWithId = { ...action.payload, id: nextId, checked: false };
            return {
                ...state,
                tags: [...state.tags, newTagWithId],
            };

        case UPDATE_TAG:
            return {
                ...state,
                tags: state.tags.map((tag) =>
                    tag.name === action.payload.oldName
                        ? { ...action.payload.newTag, checked: tag.checked }
                        : tag
                ),
            };

        case DELETE_TAG:
            return {
                ...state,
                tags: state.tags.filter((tag) => tag !== action.payload),
            };

        case DELETE_SELECTED_TAGS:
            const tagToDelete = action.payload;
            const remainingTags = state.selectedTags.filter(tag => tag.id !== tagToDelete.id);
            return {
                ...state,
                tags: tags,  // Delete from tags as well
                selectedTags: remainingTags,
            };

        case SELECT_TAG:
            const updatedTagsForSelection = state.tags.map(tag =>
                tag.name === action.payload.name
                    ? { ...tag, checked: !tag.checked }
                    : tag
            );
            const updatedSelectedTagsForSelection = updatedTagsForSelection.filter(tag => tag.checked);
            return {
                ...state,
                tags: updatedTagsForSelection,
                selectedTags: updatedSelectedTagsForSelection,
            };

        case RESET_SELECTED_TAGS:
            return {
                ...state,
                tags: state.tags.map((tag) => ({ ...tag, checked: false })),
                selectedTags: [],
            };

        case SET_SELECTED_TAGS:  // New case to handle setting selected tags
            return {
                ...state,
                selectedTags: action.payload, // Directly set selected tags
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

    const addTag = (tag) => dispatch({ type: ADD_TAG, payload: tag });
    const updateTag = (oldName, newTag) => dispatch({ type: UPDATE_TAG, payload: { oldName, newTag } });
    const deleteTag = (tag) => dispatch({ type: DELETE_TAG, payload: tag });
    const deleteSelectedTags = (tag) => dispatch({ type: DELETE_SELECTED_TAGS, payload: tag });
    const selectTag = (tag) => dispatch({ type: SELECT_TAG, payload: tag });
    const resetSelectedTags = () => dispatch({ type: RESET_SELECTED_TAGS });

    // New function to set selected tags explicitly
    const setSelectedTags = (tags) => dispatch({ type: SET_SELECTED_TAGS, payload: tags });

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
                setSelectedTags,  // Expose setSelectedTags function
            }}
        >
            {children}
        </TagsContext.Provider>
    );
};

// Custom hook to use tags context
export const useTags = () => useContext(TagsContext);
