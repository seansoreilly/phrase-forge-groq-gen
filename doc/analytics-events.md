# Google Analytics Event Taxonomy

This document outlines the custom events tracked in the Music Passphrase application. All events are sent to Google Analytics using a custom `track` function in `src/lib/analytics.ts`.

Event names use `snake_case` as per Google Analytics recommendations.

---

## 1. `generate_passphrase`

- **Description**: Fired when a user successfully receives passphrases from the API after clicking the "Generate Passphrases" button.
- **Trigger**: `Index.tsx`, upon successful API response in the `useMutation` hook.
- **Parameters**:
  - `artist_count` (number): The number of artist names provided by the user.
  - `with_numbers` (boolean): The state of the "Include Numbers" toggle.
  - `with_symbols` (boolean): The state of the "Include Special Characters" toggle.

## 2. `copy_passphrase`

- **Description**: Fired when a user clicks the "copy" button for a generated passphrase.
- **Trigger**: `Index.tsx`, in the `onCopy` function.
- **Parameters**:
  - `passphrase_index` (number): The 0-based index of the passphrase that was copied.

## 3. `toggle_option`

- **Description**: Fired when a user clicks one of the generation option toggles.
- **Trigger**: `Index.tsx`, on the `onCheckedChange` handler for the `Switch` components.
- **Parameters**:
  - `option_name` (string): The name of the toggled option (`'numbers'`, `'symbols'`, or `'spaces'`).
  - `option_state` (boolean): The new state of the toggle (`true` for on, `false` for off).

## 4. `api_error`

- **Description**: Fired when the API call to generate passphrases fails.
- **Trigger**: `Index.tsx`, in the `onError` callback of the `useMutation` hook.
- **Parameters**:
  - `error_message` (string): The error message returned from the API or client-side error.

## 5. `page_view`

- **Description**: Fired when a user navigates to a new page (automatically tracked).
- **Trigger**: `App.tsx`, in the `PageTracker` component on route changes.
- **Parameters**:
  - `page_path` (string): The current page path including search parameters.
  - `page_title` (string): The page title (defaults to document.title).
