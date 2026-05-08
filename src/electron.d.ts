interface Window {
	electronAPI?: {
		onNewCanvas: (callback: () => void) => void;
		onStartSpeedDraw: (callback: () => void) => void;
		setSpeedDrawActive: (isActive: boolean) => void;
		onExport: (callback: () => void) => void;
		setExportVisible: (visible: boolean) => void;
		saveImage: (dataURL: string) => Promise<void>;
		onUndo: (callback: () => void) => void;
		onRedo: (callback: () => void) => void;
		moveToAbout: (callback: () => void) => void;
	};
}
