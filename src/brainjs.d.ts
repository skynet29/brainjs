
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
        
    
    
        function getVideoDevices(): [VideoDevice];

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
 
        function showAlert(options, callback: () => void): void;

        interface ShowPromptOptions {
            label: string;
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
        setData(data: object): void;
        removeArrayItem(arrayBindingName: string, idx: number): void;
        updateArrayItem(arrayBindingName: string, idx: number, value: any): void;
    
        scope: Object;
        model: Object;
    }

    interface DialogController extends ViewController {
        show(title: string): void;

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


declare global {
    interface JQuery {
        getFormData(): {[fieldName]: string};
    }
}