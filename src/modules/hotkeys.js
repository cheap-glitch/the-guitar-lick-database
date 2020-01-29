
/**
 * modules/hotkeys.js
 */

import { objectMapToObject } from '@/modules/object'

export function Hotkeys(hotkeysList, disabledOnStart = false)
{
	let disabled = disabledOnStart;

	this.activate = () => disabled = false;
	this.disable  = () => disabled = true;

	// Create an array of hotkeys, each with its state and corresponding action
	const hotkeys = objectMapToObject(hotkeysList, (key, action) => ({ isPressed: false, action: action }));

	// Capture a keypress, perform an action if one is tied to it, and mark the key as pressed
	this.capture = function(event)
	{
		if (disabled) return;

		let shortkey = hotkeys[event.key];

		// Ignore the event if an input/textarea/editable div is focused
		const focusedElem = document.activeElement;
		if (focusedElem && (['input', 'textarea'].includes(focusedElem.tagName.toLowerCase()) || focusedElem.isContentEditable))
			return;

		// Check that the key is not already pressed
		// to prevent the action from being called repeatedly
		if (shortkey && shortkey.isPressed !== true)
		{
			event.preventDefault();

			shortkey.action();
			shortkey.isPressed = true;
		}
	};

	// Unmark a key as being pressed when it's released
	this.release = function(event)
	{
		if (hotkeys[event.key] !== undefined)
			hotkeys[event.key].isPressed = false;
	};

	// Add some global event listeners on the page
	document.addEventListener('keydown', this.capture);
	document.addEventListener('keyup',   this.release);

	// Remove the global listeners
	this.destroy = function()
	{
		document.removeEventListener('keydown', this.capture);
		document.removeEventListener('keyup',   this.release);
	};
}
