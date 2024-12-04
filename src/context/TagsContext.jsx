import React, { createContext, useContext, useReducer } from 'react';
import tags from '../mock-data/exampleTags.json';

// Action types
const ADD_TAG = 'ADD_TAG';
const UPDATE_TAG = 'UPDATE_TAG';
const DELETE_TAG = 'DELETE_TAG';
const DELETE_SELECTED_TAGS = 'DELETE_SELECTED_TAGS'; // New action type
const SELECT_TAG = 'SELECT_TAG';
const RESET_SELECTED_TAGS = 'RESET_SELECTED_TAGS';

// Initial state
const initialState = {
    tags: tags.map(tag => ({ ...tag, checked: false })),  // Initialize tags with checked state
    selectedTags: [],
};

// Reducer function to handle state changes
const tagsReducer = (state, action) => {
    switch (action.type) {
        case ADD_TAG:
            return {
                ...state,
                tags: [...state.tags, { ...action.payload, checked: false }],
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
                tags: state.tags.filter((tag) => tag.name !== action.payload),
            };
        case DELETE_SELECTED_TAGS:
            // Получаем тег для удаления из payload
            const tagToDelete = action.payload;
            console.log("Deleting tag:", tagToDelete);

            // Фильтруем массив selectedTags, удаляя тег, который соответствует tagToDelete
            const remainingTags = state.selectedTags.filter(tag => tag.id !== tagToDelete.id);

            return {
                ...state,
                tags: tags,         // Update tags if needed
                selectedTags: remainingTags,    // Update selectedTags
            };

        case SELECT_TAG:
            // Toggle the checked state of the selected tag
            const updatedTagsForSelection = state.tags.map(tag =>
                tag.name === action.payload.name
                    ? { ...tag, checked: !tag.checked } // Toggle checked state for the tag
                    : tag
            );

            // Update selectedTags based on the new checked state
            const updatedSelectedTagsForSelection = updatedTagsForSelection.filter(tag => tag.checked);

            return {
                ...state,
                tags: updatedTagsForSelection,              // Updated tags array
                selectedTags: updatedSelectedTagsForSelection, // Updated selectedTags
            };
        case RESET_SELECTED_TAGS:
            return {
                ...state,
                tags: state.tags.map((tag) => ({ ...tag, checked: false })),
                selectedTags: [],
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
    const deleteTag = (tagName) => dispatch({ type: DELETE_TAG, payload: tagName });

    // Modify deleteSelectedTags to accept a tag parameter and dispatch it
    const deleteSelectedTags = (tag) => dispatch({ type: DELETE_SELECTED_TAGS, payload: tag });  // Pass tag as payload

    const selectTag = (tag) => dispatch({ type: SELECT_TAG, payload: tag });
    const resetSelectedTags = () => dispatch({ type: RESET_SELECTED_TAGS });

    return (
        <TagsContext.Provider
            value={{
                tags: state.tags,
                selectedTags: state.selectedTags,
                addTag,
                updateTag,
                deleteTag,
                deleteSelectedTags,  // Expose modified function
                selectTag,
                resetSelectedTags,
            }}
        >
            {children}
        </TagsContext.Provider>
    );
};

// Custom hook to use tags context
export const useTags = () => useContext(TagsContext);