
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
            init(elt: JQuery): void;
            $iface?: string;

        }

        function registerControl(ctrlName: string, options: RegisterControlOptions): void
    }

    declare namespace service {
        interface RegisterServiceOptions {
            deps?: Array<string>;
            init(elt: JQuery): void;
            $iface?: string;

        }

        function registerService(ctrlName: string, options: RegisterServiceOptions): void
    }    

    declare namespace util {
        function getUrlParams(url: string, params: Object): string;
 
    }

    interface ViewController {
        update(): void;
        setData(data: object): void;
        scope: Object;
        model: Object;
    }

    interface ViewControllerOptions {
        data: Object;
        events?: Object;
    }
    function viewController(elt: JQuery, options: ViewControllerOptions):ViewController;
}
