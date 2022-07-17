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


    declare namespace file {
        function readTextFile(fileName: string): Pormise<string>;
        function readFileAsDataURL(fileName: string): Promise<string>;
        function readFile(fileName: string): Promise<Blob>;
        function isImage(fileName: string): boolean;
        function getFileType(fileName: string): string;
    }

    declare namespace url {
        function buildDataURL(type: string, subtype: string, data: string): string;
        function dataURLtoBlob(dataURL: string): Blob;
        function getUrlParams(url: string, params: Object): string;
        function parseUrlParams(url: string): { [param]: any };
        function downloadUrl(url: string, fileName: string): void;
        function imageUrlToDataUrl(url: string): string;
    }

    declare namespace media {
        interface InputDevice {
            id: string;
            label: string;
        };

        function getAudioInputDevices(): Promise<InputDevice[]>;
        function getVideoDevices(): Promise<InputDevice[]>;
        
        function decodeAudioData(blob: Blob): Promise<AudioBuffer>;
        function getAudioBuffer(url: string): Promise<AudioBuffer>;

        function drawAudioBuffer( width: number, height: number, context: CanvasRenderingContext2D, buffer: AudioBuffer, color: string ): void;

        function getFormatedTime(duration: number, showMilliseconds: boolean = false): string;
        
    }

    declare namespace util {
        function isObject(a: any): boolean;
        function arrayBufferToString(buffer: ArrayBuffer): string;
        function isMobileDevice(): boolean;
        function isTouchDevice(): boolean;
        function knuthShuffle(length: number): number[];
        function concatTypedArray(a, b);
        function wait(delayMs: number): Promise<void>;
        function objToArray2(obj: Object):{name: string, value:any}[];
        function mergeArray(a: Array<T>, b: Array<T>): Array<T>;
        function getEnumName(enumVal: {[key:string]: number}): {[key:number]: string};
        function mapRange(inMin: number, inMax: number, outMin: number, outMax: number): (val: number) => number;


    };

    declare namespace ui {

        function openFileDialog(callback: (result: File | FileList) => void, multiple: boolean = false): void;

        interface ShowConfirmOptions {
            title?: string;
            content: string | {[label: string]: string};
            okText?: string;
            cancelText?: string;
        }
        function showConfirm(options: ShowConfirmOptions, callback: () => void): void;

        function showAlert(options: ShowConfirmOptions, callback?: () => void): void;

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
            data?: { [fieldName]: any };
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
        enableNode(bindingName: string, isEnabled:boolean): void;
        setData(data: object, forceUpdate: boolean = false): void;
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
        title?: string;
        canClose?: boolean;
        template: string | {gulp_inject: string};
        width?: number;
        resizable?: boolean;
    };

    function viewController(elt: JQuery, options: ViewControllerOptions): ViewController;
    function dialogController(options: DialogControllerOptions): DialogController;

    interface FormDialogController {
        show(formData?: object, isReset?: boolean): Promise<object>;
        setData(data: object): void;
        getFormData(): object;
        setFormData(data: object):void;
        destroy(): void;

    }


    function formDialogController(options: DialogControllerOptions): FormDialogController;

}


declare namespace Brainjs {

    declare namespace Services {

        declare namespace BeatDetector {

            interface BeatInfo {
                tempo: number;
                score: number;
                peaks: Array<number>;
            }
            
            interface Interface {
                computeBeatDetection(audioBuffer: AudioBuffer): Promise<BeatInfo>;
            }
        }

        declare namespace Http {
            interface Interface {
                get(url: string, params?: { [param]: any }): Promise<void>;
    
                fetch(url: string, params?: { [param]: any }): Promise<Response>;
    
                post(url: string, params?: { [param]: any }): Promise<void>;
                put(url: string, params?: { [param]: any }): Promise<void>;
                postFormData(url: string, fd: FormData, onUploadProgress: () => void): Promise<void>;

            }
        }

        declare namespace Resource {
            type Interface = (prefix: string) => Http.Interface;
        }
    }

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

        declare namespace Slider {

            type Events = 'sliderchange' | 'input'

            interface Props {
                max: number;    // default 100
                min: number;    // default 0
                step: number    // default 1
                orientation: 'horizontal' | 'vertical'; // default horizontal     
                range: boolean; // default false           
            }
        }

        declare namespace Flipswitch {
            type Events = 'flipswitchchange'
        }

        declare namespace Camera {

            type Events = 'cameraready' | 'barcode' | 'videorecord';

            interface Props {
                constraints?: MediaStreamConstraints;
                mimeType?: string;
            }

            declare namespace EventData {
                interface VideoRcord {
                    blob: Blob;
                }

                interface BarCode {
                    format: string;
                    rawValue: string;
                }
            }

            interface Interface {
                getCapabilities(): Promise<MediaTrackCapabilities>;
                getSettings(): MediaTrackSettings;
                startBarcodeDetection(): void;
                stopBarcodeDetection(): void;
                isBarcodeDetectionAvailable(): boolean;
                setZoom(value: number): void;
                takePicture(): Promise<Blob>;
                start(): void;
                stop(): void;
                startRecord(): void;
                stopRecord(): void;
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

            type Events = 'treeactivate' | 'treecontextmenu | treeclick'

            declare namespace EventData {
                interface TreeContextMenu {
                    action: string;
                    node: TreeNode;
                }
            }

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
                fit(): Promise;
                zoomIn(): Promise;
                zoomOut(): Promise;
                rotateLeft(): Promise;
                rotateRight(): Promise;
                print(options?: {title?: string, onProgress?: (data: {page: number}) => void}): Promise;
                refresh():Promise;
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

            interface LatLng {
                lat: number;
                lng: number
            }

            interface LayerInfo {
                label?: string;
                visible?: boolean;
            }

            interface AisMarkerInfo {
                type: 'ais',
                color?: string; // default 'green'
            }

            interface FontMarkerInfo {
                type: 'font';
                color?: string;     // default 'green'
                className?: string; // default 'fa fa-home'
                fontSize?: number;  // default 10
            }

            type MarkerIconInfo = AisMarkerInfo | FontMarkerInfo

            interface PopupOptions {
                content?: string;
                className?: string;
                closeButton?: boolean;
            }

            interface ContextMenuOption {
                name: string;
                iconCls: string;
            }

            interface ShapeBase {
                layer?: string;
            }

            interface VectorShapeStyle {
                stroke?: boolean;
                color?: string;          // stroke color, default "#3388ff"
                weight?: number;        // stroke width
                opacity?: number;        // stroke opacity, default 1.0
                lineCap?: string;       // default 'round'
                lineJoin?: string;      // default 'round'
                dashArray?: string;
                fill?: boolean;
                fillColor?: string;
                fillOpacity?: number;   // default 0.2
                fillRule?: string;      // default 'evenodd'

            }

            interface VectorShape extends ShapeBase {
                style?: VectorShapeStyle;
            }

            declare namespace Shape {

                interface PolyLine extends VectorShape { 
                    type: 'polyline';
                    latlngs: LatLng[];
                }

                interface Polygon extends VectorShape { 
                    type: 'polygon';
                    latlngs: LatLng[];
                }

                interface Rectangle extends VectorShape {
                    type: 'rectangle';
                    southEast: LatLng;
                    northWest: LatLng;
                }

                interface Marker extends ShapeBase {
                    type: 'marker';
                    latlng: LatLng;
                    rotationAngle?: number;
                    icon?: MarkerIconInfo;
                    popupContent?: string;
                    popup?: PopupOptions;
                    contextMenu?: { [key: string]: ContextMenuOption };    
                }

                interface Circle extends VectorShape {
                    type: 'circle';
                    latlng: LatLng;
                    radius: number;
                }

                interface Sector extends Circle {
                    type: 'sector'
                    size: number;
                    direction: number;
                }
    
            }

            type ShapeInfo = Shape.Marker | Shape.Rectangle | Shape.Circle | Shape.PolyLine | Shape.Sector | Shape.Polygon;

            interface Position {
                x: number;
                y: number;
            }

            declare namespace Plugins {
                declare namespace Editor {

                    type Events = 'mapshapecreated' | 'mapshapeedited' | 'mapshapedeleted'

                    declare namespace EventData {
                        interface MapShapeCreated extends ShapeInfo {

                        }

                        interface MapShapeEdited {
                            editedShapes: string[];
                        }

                        interface MapShapeDeleted {
                            deletedShapes: string[];
                        }

                    }

                    interface Config {
                        editLayer: string;
                    }
                }
            }

            type Events = 'mapcontextmenu' | 'mapclick' | 'mapshapecontextmenu';

            declare namespace EventData {
                interface MapClick {
                    latlng: LatLng;
                }

                interface MapContextMenu {
                    latlng: LatLng;
                    cmd: string;
                }

                interface MapShapeContextMenu extends MapContextMenu {
                    id: string;
                    pos: Position;
                }
            }

            interface Props {
                tileUrl: string;
                center?: LatLng;
                zoom?: number;
                scale?: boolean;
                coordinates?: boolean;
                contextMenu?: { [key]: ContextMenu.Item };
                layers?: { [layerId: string]: LayerInfo };
                plugins?: { [key]: object };
                shapes?: {[shapeId: string]: ShapeInfo};
            }

            interface Interface {
                getShapes(): string[];
                updateShape(shapeId: string, options: {[shapeProp: string]: any}): void;
                addShape(shapeId: string, options: ShapeInfo): void;
                removeShape(shapeId: string): void;
                getShapeInfo(shapeId: string): ShapeInfo;
                enableHandlers(enabled: boolean): void;
                getZoom(): number;
                getCenter(): LatLng;
                panTo(latlng: LatLng);
                flyTo(latlng: LatLng, zoom: number): void;
            }
        }

        declare namespace Image {
            interface Props {
                src: string;
            }

            interface Interface {
                invalidateSize(): void;
                enableHandlers(isEnabled: boolean): void;
                enableContextMenu(isEnabled: boolean); void;
                fitImage(): void;
                rotate(angleDeg: number): void;
                setData(data: Props): void;
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
    getFormData(): object;
    getValue(): any;
    setValue(val: any): void;
    setProp(props: object): void;
    setData(data: object): void;
    setClass(data: { [fieldName: string]: boolean })
    setVisible(isVisble: boolean): void;
    setFormData(data: object): void;
    safeEmpty(): void;
    setItems(items: string[] | ({label: string, value: string})[])
    iface(): any;
    resetForm(): void;
    scrollToBottom(): void;
}
