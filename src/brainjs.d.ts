declare namespace $$ {

    interface Object {
        [key: string]: any
    }

    interface GulpInject {
        gulp_inject: string;
    }
    declare namespace control {
        interface RegisterControlOptions {
            deps?: string[];
            props?: Object;
            template?: string | GulpInject;
            init(elt: JQuery, ...services): void;
            $iface?: string;
            $events?: string;

        }

        function registerControl(ctrlName: string, options: RegisterControlOptions): void;
    }

    declare namespace service {
        interface RegisterServiceOptions {
            deps?: string[];
            init(config: any, ...services): void;
            $iface?: string;

        }

        function registerService(ctrlName: string, options: RegisterServiceOptions): void;
    }


    declare namespace util {
        function getUrlParams(url: string, params: Object): string;
        function readTextFile(fileName: string, onRead: (result: string) => void): void;
        function readFileAsDataURL(fileName: string, onRead: (result: string) => void): void;
        function readFile(fileName: string): Promise<Blob>;

        function openFileDialog(callback: (result: File | FileList) => void, multiple: boolean = false): void;

        function isImage(fileName: string): boolean;

        function getFileType(fileName: string): string;

        function buildDataURL(type: string, subtype: string, data: string): string;

        function dataURLtoBlob(dataURL: string): Blob;

        function isObject(a: any): boolean;

        interface VideoDevice {
            id: string;
            label: string;
        };



        function getVideoDevices(): Promise<VideoDevice[]>;

        function decodeAudioData(blob: Blob): Promise<AudioBuffer>;

        function arrayBufferToString(buffer: ArrayBuffer): String;

        function parseUrlParams(url: string): { [param]: any };

        function downloadUrl(url: string, fileName: string): void;

        function isMobileDevice(): boolean;

        function isTouchDevice(): boolean;

        function knuthShuffle(length: number): number[];

        function concatTypedArray(a, b);

        function wait(delayMs: number): Promise;
        function imageUrlToDataUrl(url: string): string;

    };

    declare namespace ui {

        interface ShowConfirmOptions {
            title: string;
            content: string;
            okText?: string;
            cancelText?: string;
        }
        function showConfirm(options: ShowConfirmOptions, callback: () => void): void;

        function showAlert(options, callback?: () => void): void;

        interface ShowPromptOptions {
            label: string;
            title: string;
            attrs?: { [attr]: any };
            value?: string | number;

        };

        function showPrompt(options: ShowPromptOptions): Promise<string>;

        interface FieldDescriptor {
            label: string;
            input: string;
            value: string;
            attrs: { [attrName]: any }
        };

        interface FormOptions {
            title: string;
            fields: { [fieldName]: FieldDescriptor };
            data: { [fieldName]: any };
        };

        function showForm(formDesc: FormOptions, onApply: (data: { [fieldName]: any }) => void): void;

        interface ProgressDialogInterface extends DialogController {
            setPercentage(percentage: number): void;
        }

        function progressDialog(title?: string): ProgressDialogInterface;

        function waitDialog(title: string): DialogController;
    }


    declare namespace crypto {
        function encrypt(password: string, text: string): string;
        function decrypt(password: string, data: string): string;

    }

    interface ViewController {
        update(): void;
        updateNode(bindingName: string): void;
        updateNodeTree(bindingName: string): void;
        setData(data: object): void;
        removeArrayItem(arrayBindingName: string, idx: number, varName?: string): void;
        updateArrayItem(arrayBindingName: string, idx: number, value: any, varName?: string): void;
        insertArrayItemAfter(arrayBindingName: string, idx: number, value: any, varName?: string): void;
        insertArrayItemBefore(arrayBindingName: string, idx: number, value: any, varName?: string): void;
        updateArrayValue(arrayBindingName: string, varName: string): void;

        scope: Object;
        model: Object;
    }

    interface DialogController extends ViewController {
        show(title?: string): void;

        hide(): void;
        setOption(optionName: string, value: any): void;
        destroy(): void;
    };

    interface ViewControllerOptions {
        data: Object;
        events?: {
            [key: string]: (ev: JQuery.TriggeredEvent, ...params) => void;
        };
    }

    interface DialogControllerOptions extends ViewControllerOptions {
        title: string;
        canClose: boolean;
        template: string;
        width: number;
        resizable: boolean;
    };

    function viewController(elt: JQuery, options: ViewControllerOptions): ViewController;

    function dialogController(options: DialogControllerOptions): DialogController;

}


declare namespace Brainjs {

    declare namespace Controls {

        declare namespace FlightPanel {
            interface Props {
                roll: number;
                pitch: number;
                altitude: number;
                speed: number;
            }
        }

        declare namespace CircularMenu {

            interface Position {
                left: number;
                top: number;
            }

            interface ItemInfo {
                text: string;
                className: string;
                color: string;
                action: string;

            }

            interface Props {
                triggerRadius: number;
                hasTrigger: boolean;
                triggerPos: Position;
                innerRadius: number;
                radius: number;
                iconPos: number;
                iconSize: number;
                gap: number;
                items: ItemInfo[];
                minSectors: number;
            }

            type Events = 'menuClosed' | 'menuSelected'

            interface Interface {
                select(idx: number): this;
                closeMenu(callback: () => void);
                showMenu(x: number, y: number): void;
            }
        }

        declare namespace Camera {

            type Events = 'cameraready' | 'barcode' | 'videorecord';

            interface Props {
                constraints?: MediaStreamConstraints;
                mimeType?: string;
            }

            interface BarcodeInfo {
                format: string;
                rawValue: string;
            }

            declare namespace EventData {
                interface VideoRcord {
                    blob: Blob;
                }

                interface BarCode {
                    barcode: BarcodeInfo;
                }
            }

            interface Interface {
                getCapabilities(): Promise<MediaTrackCapabilities>;
                getSettings(): MediaTrackSettings;
                startBarcodeDetection();
                setZoom(value: number);
                takePicture(): Promise<Blob>;
                start();
                stop();
                startRecord();
                stopRecord()
            }
        }

        declare namespace Tabs {
            interface TabsOption {
                control?: string;
                props?: {};
                template?: string;
                removable?: boolean;
            }

            interface TabInfo {
                title: string;
                ctrlIface: any;
            }

            interface Interface {
                getTabsCount(): number;
                addTab(title: string, options: TabsOption): number;
                removeTab(tabIndex: number): void;
                getSelectedTabIndex(): number
                getTabInfo(tabIndex: number): TabInfo;
                setSelectedTabIndex(tabIndex: number): void;
                getTabIndexFromTitle(title: string): number;
            }
        }

        declare namespace Tree {
            interface NodeInfo {
                data: object;
                title: string;
                folder?: boolean;
                children?: NodeInfo[];
            }

            interface Props {
                contextMenu?: { [key]: ContextMenu.Item };
                source: NodeInfo[];
            }

            interface TreeNode extends NodeInfo {
                setExpanded(isExpanded: boolean): void;
                addNode(node: NodeInfo): TreeNode;
                remove(): void;
            };

            type Events = 'treeactivate' | 'treecontextmenu'

            interface Interface {
                getActiveNode(): TreeNode;
                getRootNode(): TreeNode;
                getNodePath(node: TreeNode, callback?: (node: TreeNode) => string): string
            }
        }

        declare namespace Pdf {
            interface Interface {
                openFile(url: string): Promise<number>;
                prevPage(): Promise<number>;
                nextPage(): Promise<number>;
                setPage(pageNo: number): Promise<number>;
                fit(): void;
                print(): Promise;
            }
        }


        declare namespace ContextMenu {

            type Events = 'contextmenuchange'

            declare namespace EventData {
                interface ContextMenuChange {
                    cmd: string;
                }
            }

            interface Item {
                name: string;
                icon: string;
            }

            interface Props {
                trigger: 'right' | 'left';
                title: string;
                fontSize: string;
                items: { [key]: Item };
            }
        }

        declare namespace ComboBox {

            type Events = 'comboboxchange'

            interface Item {
                label: string;
                value: string;
            }

            interface Props {
                width: string | boolean;
                maxHeight: number;
                items: Array<string | Item>;
            }

            interface Interface {
                setValue(val: string): void;
                getValue(): string;
                getSelItem(): Item;
            }
        }

        declare namespace Map {

            type Events = 'mapcontextmenu' | 'mapclick' | 'mapshapecontextmenu';

            interface LatLng {
                lat: number;
                lng: number
            }

            interface LayerInfo {
                label?: string;
                visible?: boolean;
            }

            interface Props {
                tileUrl: string;
                center: LatLng;
                zoom: number;
                scale: boolean;
                coordinates: boolean;
                contextMenu: { [key]: ContextMenu.Item };
                layers: { [key]: LayerInfo };
                plugins: { [key]: object };
            }

            type ShapeType = 'marker' | 'circle';

            interface IconInfo {
                type: string;
                color?: string;
                className?: string;
                fontSize?: number;

            }

            interface PopupOptions {
                content?: string;
                className?: string;
                closeButton?: boolean;
            }

            interface ContextMenuOption {
                name: string;
                iconCls: string;
            }

            interface ShapeInfo {
                latlng?: LatLng;
                type?: ShapeType;
                layer?: string;
                rotationAngle?: number;
                icon?: IconInfo;
                popupContent?: string;
                radius?: number;
                popup?: PopupOptions;
                contextMenu?: {[key]: ContextMenuOption};
            }

            interface Interface {
                getShapes(): string[];
                updateShape(shapeId: string, options: ShapeInfo): void;
                addShape(shapeId: string, options: ShapeInfo): void;
                removeShape(shapeId: string): void;
                getShapeInfo(shapeId: string): ShapeInfo;
                enableHandlers(enabled: boolean): void;
                getZoom(): ZoomLevel;
                getCenter(): LatLng;
                panTo(latlng: LatLng);
                flyTo(latlng: LatLng, zoom: number): void;
            }
        }

        declare namespace MilSymbol {
            interface Props {
                size: number;
                name: string;
                sidc: string;
            }
        }
    }
}

interface JQuery {
    getFormData(): { [fieldName]: string };
    getValue(): any;
    setValue(val: any): void;
    iface(): any;
    resetForm(): void;
}
