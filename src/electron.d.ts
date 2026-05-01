interface Window {
	electronAPI?: {
		onNewCanvas: (callback: () => void) => void;
		onExport: (callback: () => void) => void;
		saveImage: (dataURL: string) => Promise<void>;
		onSetMode: (callback: (mode: string) => void) => void;
	};
}
