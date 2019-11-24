
/**
 * modules/fontawesome.js
 */

import Vue		   from 'vue';
import { library }	   from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

// Register the Vue component
Vue.component('fa-icon', FontAwesomeIcon);

/**
 * Import the icons
 * -----------------------------------------------------------------------------
 */
import {
	// General UI
	faChevronDown,
	faExternalLinkSquareAlt,
	faStar as farStar,
	faTrashAlt,

	// Lick infos
	faAlbum,
	faBook,
	faCompactDisc,
	faFileAlt,
	faFileMusic,
	faGuitarElectric,
	faMountain,
	faMusic,
	faTags,
	faUserCircle,

	// Player
	faDrum,
	faMinus,
	faPause,
	faPlay,
	faPlus,
	faSearchMinus,
	faSearchPlus,
	faStop,
	faStopwatch,
	faUndoAlt,
} from '@fortawesome/pro-regular-svg-icons';

import {
	// Logo
	faCommentAltMusic,
	faSquareFull,

	// Main navigation menu
	faGuitar,
	faHeart,
	faListUl,
	faRandom,

	// General UI
	faStar as fasStar,
} from '@fortawesome/pro-solid-svg-icons';

import {
	// Lick infos
	faYoutube,
} from '@fortawesome/free-brands-svg-icons';

/**
 * Register the icons
 * -----------------------------------------------------------------------------
 */
library.add(
	// Logo
	faCommentAltMusic,
	faSquareFull,

	// Main navigation menu
	faGuitar,
	faHeart,
	faListUl,
	faRandom,

	// General UI
	faChevronDown,
	faExternalLinkSquareAlt,
	farStar,
	fasStar,
	faTrashAlt,

	// Lick infos
	faAlbum,
	faBook,
	faCompactDisc,
	faFileAlt,
	faFileMusic,
	faGuitarElectric,
	faMountain,
	faMusic,
	faTags,
	faUserCircle,
	faYoutube,

	// Player
	faDrum,
	faMinus,
	faPause,
	faPlay,
	faPlus,
	faSearchMinus,
	faSearchPlus,
	faStop,
	faStopwatch,
	faUndoAlt,
);
