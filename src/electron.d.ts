interface Window {
	electronAPI?: {
		onNewPainting: (callback: () => void) => void;
	};
}
