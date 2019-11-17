
/**
 * modules/hotkeys.js
 */

import { mapToObject } from '@/modules/object';

export function Hotkeys(_hotkeys, _disabled = false)
{
	let disabled = _disabled;

	this.activate = () => disabled = false;
	this.disable  = () => disabled = true;

	// Create an array of hotkeys, each with its state and corresponding action
	const hotkeys = mapToObject(_hotkeys, (_key, _action) => ({ isPressed: false, action: _action }));

	// Capture a keypress, perform an action if one is tied to it, and mark the key as pressed
	this.capture = function(_event)
	{
		if (disabled) return;

		let shortkey = hotkeys[_event.key];

		// Ignore the event if an input/textarea/editable div is focused
		const focusedElem = document.activeElement;
		if (focusedElem && (['input', 'textarea'].includes(focusedElem.tagName.toLowerCase()) || focusedElem.isContentEditable))
			return;

		// Check that the key is not already pressed
		// to prevent the action from being called repeatedly
		if (shortkey && shortkey.isPressed !== true)
		{
			_event.preventDefault();

			shortkey.action();
			shortkey.isPressed = true;
		}
	};

	// Unmark a key as being pressed when it's released
	this.release = function(_event)
	{
		if (hotkeys[_event.key] !== undefined)
			hotkeys[_event.key].isPressed = false;
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
