import {createSignal} from "solid-js";
import {actions} from "astro:actions";

export function useAddClipForm() {
  const [isExpanded, setIsExpanded] = createSignal(false);
  const [error, setError] = createSignal('');
  const [success, setSuccess] = createSignal(false);
  const [clipUrl, setClipUrl] = createSignal('');
  // Toggle form visibility
  const toggleForm = () => {
    setIsExpanded((e) => !e);
  };

  // Handle form submission
  const handleSubmit = async (e: Event) => {
    e.preventDefault();

    // Reset messages
    setError('');
    setSuccess(false);

    try {
      // Call the addClip action
      const {data, error} = await actions.addClip(clipUrl());

      if (error) {
        setError(error.message || 'Failed to add clip. Please try again.');
        setSuccess(false);
        return
      }

      // Show success message
      setSuccess(true);

      // Clear the form
      setClipUrl('');

      // Refresh the page after a short delay to show the new clip
      setTimeout(() => {
        window.location.reload();
      }, 1500);

    } catch (e: any) {
      // Show error message
      setError(e.message || 'Failed to add clip. Please try again.');
    }
  };

  return {
    isExpanded, toggleForm, error, setError, success, setSuccess, clipUrl, setClipUrl,
    handleSubmit,
  }
}
