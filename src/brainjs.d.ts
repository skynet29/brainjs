
declare namespace $$ {

    interface Object {
        [key: string]: any
    }    

    interface GulpInject {
        gulp_inject: string;
    }
    declare namespace control {
        interface RegisterControlOptions {
            deps?: Array<string>;
            props?: Object;
            template?: string | GulpInject;
            init(elt: JQuery, ...params): void;
            $iface?: string;
            $events?: string;

        }

        function registerControl(ctrlName: string, options: RegisterControlOptions): void;
    }

    declare namespace service {
        interface RegisterServiceOptions {
            deps?: Array<string>;
            init(elt: JQuery): void;
            $iface?: string;

        }

        function registerService(ctrlName: string, options: RegisterServiceOptions): void;
    }    


    declare namespace util {
        function getUrlParams(url: string, params: Object): string;
        function readTextFile(fileName: string, onRead: (result: string) => void ): void;
        function readFileAsDataURL(fileName: string, onRead: (result: string) => void ): void;  
        function readFile(fileName: string): Promise<Blob>;
    
        function openFileDialog(callback: (result: File) => void, multiple: boolean = false): void;
    
        function isImage(fileName: string): boolean;
    
        function getFileType(fileName: string): string;
    
        function buildDataURL(type: string, subtype: string, data: string): string;
    
        function dataURLtoBlob(dataURL: string): Blob;
        
        function isObject(a: any): boolean;
    
        interface VideoDevice  {
            id: string;
            label: string;
        };
        
    
    
        function getVideoDevices(): Promise<[VideoDevice]>;

        function decodeAudioData(blob: Blob): Promise<AudioBuffer>;
        
        function arrayBufferToString(buffer: ArrayBuffer): String;
    
        function parseUrlParams(url: string):  {[param]: any};
    
        function downloadUrl(url: string, fileName: string): void;
    
        function isMobileDevice(): boolean;
    
        function isTouchDevice(): boolean;

        function knuthShuffle(length: number): [number];
    
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
            attrs?: {[attr]: any};

        };

        function showPrompt(options: ShowPromptOptions): Promise<string>;

        interface FieldDescriptor {
            label: string;
            input: string;
            value: string;
            attrs: {[attrName]: any}
        };

        interface FormOptions {
            title: string;
            fields: {[fieldName]: FieldDescriptor};
            data: {[fieldName]: any};
        };

        function showForm(formDesc: FormOptions, onApply: ( data: {[fieldName]: any}) => void): void;

        interface ProgressDialogInterface extends DialogController {
            setPercentage(percentage: number): void;
        }

        function progressDialog(title: string): ProgressDialogInterface;

        function waitDialog(title: string): DialogController;
    }


    declare namespace crypto {
        function encrypt(password: string, text: string): string;
        function decrypt(password: string, data: string): string;
 
    }

    interface ViewController {
        update(): void;
        updateNode(bindingName: string): void;
        setData(data: object): void;
        removeArrayItem(arrayBindingName: string, idx: number, varName?: string): void;
        updateArrayItem(arrayBindingName: string, idx: number, value: any, varName?: string): void;
        insertArrayItemAfter(arrayBindingName: string, idx: number, value: any, varName?: string): void;
        updateArrayValue(arrayBindingName: string, varName: string): void;
    
        scope: Object;
        model: Object;
    }

    interface DialogController extends ViewController {
        show(title?: string): void;

        hide(): void;
        setOption(optionName: string, value: any): void;
        destroy() :void;
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

    function viewController(elt: JQuery, options: ViewControllerOptions):ViewController;

    function dialogController(options: DialogControllerOptions): DialogController;

}


declare namespace Brainjs {

    declare namespace Controls {

        interface Camera {
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

        interface TabsOption {
            control?: string;
            props?:{};
            template?: string;
            removable?: boolean;
        }

        interface TabInfo {

        }

        interface Tabs {
            getTabsCount(): number;
            addTab(title: string, options: TabsOption): number;
            removeTab(tabIndex: number): void;
            getSelectedTabIndex(): number
            getTabInfo(tabIndex: number): TabInfo;
            setSelectedTabIndex(tabIndex: number): void;
            getTabIndexFromTitle(title: string): number;
        }

        interface TreeNode {
            data: object;
        };

        interface Tree {
            getActiveNode():TreeNode;
            getRootNode():TreeNode;
            getNodePath(node: TreeNode, callback?: (node: TreeNode) => string):string            
        }

        interface Pdf {
            openFile(url: string):Promise<number>;
            prevPage():Promise<number>;
            nextPage():Promise<number>;
            setPage(pageNo: number):Promise<number>;
            fit(): void;      
            print(): Promise;      
        }
    }
}

interface JQuery {
    getFormData(): {[fieldName]: string};
    getValue(): any;
    setValue(val: any): void;
    iface():any;
    resetForm(): void;
}
