/** @ignore */
declare class GoldenLayout implements GoldenLayout.EventEmitter<GoldenLayout.Events.GoldenLayoutEvent> {
    /**
     * The topmost item in the layout item tree. In browser terms: Think of the GoldenLayout instance as window
     * object and of goldenLayout.root as the document.
     */
    root: GoldenLayout.ContentItem;

    /**
     * A reference to the (jQuery) DOM element containing the layout
     */
    container: JQuery;

    /**
     * True once the layout item tree has been created and the initialised event has been fired
     */
    isInitialised: boolean;

    /**
     * A reference to the current, extended top level config.
     *
     * Don't rely on this object for state saving / serialisation. Use layout.toConfig() instead.
     */
    config: GoldenLayout.LayoutConfig;

    /**
     * The currently selected item or null if no item is selected. Only relevant if settings.selectionEnabled is set
     * to true.
     */
    selectedItem: GoldenLayout.ContentItem;

    /**
     * The current outer width of the layout in pixels.
     */
    width: number;

    /**
     * The current outer height of the layout in pixels.
     */
    height: number;

    constructor(config: GoldenLayout.LayoutConfig, container?: string);

    init(): void;

    registerComponent(containerId: string, callback: GoldenLayout.RegisterCallback): void;

    toConfig(): GoldenLayout.LayoutConfig;

    updateSize(): void;

    on(eventName: GoldenLayout.Events.GoldenLayoutEvent, callback: GoldenLayout.EventCallback, context?: any): void;

    emit(eventName: GoldenLayout.Events.GoldenLayoutEvent, ...args: any): void;

    trigger(eventName: GoldenLayout.Events.GoldenLayoutEvent, ...args: any): void;

    unbind(eventName: GoldenLayout.Events.GoldenLayoutEvent, callback: GoldenLayout.EventCallback, context?: any): void;

    off(eventName: GoldenLayout.Events.GoldenLayoutEvent, callback: GoldenLayout.EventCallback, context?: any): void;
}

/** @ignore */
declare namespace GoldenLayout {
    namespace Events {
        type GoldenLayoutEvent =
            // Fired after layout.init() has been called and the layout tree has been created.
            "initialised" |
            // Fired whenever something happens that updates the state of the layout (as returned by layout.toConfig)
            "stateChanged" |
            // Fired when a new popout window was opened.
            "windowOpened" |
            // Fired when a previously created popout window was closed.
            "windowClosed" |
            // Fired when the user selects a new / different item. Only relevant if settings.selectionEnabled is true.
            "selectionChanged" |
            // Fired whenever an item gets destroyed.
            "itemDestroyed" |
            // Fired whenever an item is created.
            "itemCreated" |
            // Fired whenever a component is created.
            "componentCreated" |
            // Fired whenever a row is created.
            "rowCreated" |
            // Fired whenever a column is created.
            "columnCreated" |
            // Fired whenever a stack is created.
            "stackCreated" |
            // Fired whenever a tab is created.
            "tabCreated";

        type ContainerEvent =
            // Emitted after the item has been sized and added to the DOM. Useful if you're working with an UI library that measures its container on startup.
            "open" |
            // Emitted after the container has been resized
            "resize" |
            // Emitted before the container will be destroyed. This will happen when the user clicks close as well as when a higher up part of the tree is destroyed.
            "destroy" |
            // Emitted when the container is closed. Closing the container will also call destroy. To clarify: Only subscribe to this event if you want to do something specific when the user clicks close, otherwise always subscribe to destroy
            "close" |
            // Emitted when a tab for this container is created. Can be called more than once (e.g. when a new tab is created as result of dragging the item to a different position).
            "tab" |
            // Emitted before the container is hidden
            "hide" |
            // Emitted before the container is shown
            "show";
    }

    interface EventEmitter<T> {
        /**
         * Subscribe to an event
         * @param eventName The name of the event to describe to
         * @param callback  The function that should be invoked when the event occurs
         * @param context   The value of the this pointer in the callback function
         */
        on(eventName: T, callback: EventCallback, context?: any): void;

        /**
         * Notify listeners of an event and pass arguments along
         * @param eventName The name of the event to emit
         * @param args
         */
        emit(eventName: T, ...args: any): void;

        /**
         * Alias for emit
         */
        trigger(eventName: T, ...args: any): void;

        /**
         * Unsubscribes either all listeners if just an eventName is provided,
         * just a specific callback if invoked with eventName and callback or
         * just a specific callback with a specific context if invoked with all three arguments.
         * @param eventName The name of the event to unsubscribe from
         * @param callback  The function that should be invoked when the event occurs
         * @param context   The value of the this pointer in the callback function
         */
        unbind(eventName: T, callback: EventCallback, context?: any): void;

        /**
         * Alias for unbind
         */
        off(eventName: T, callback: EventCallback, context?: any): void;
    }

    type ItemConfigType = ItemConfig | ComponentConfig;

    interface ItemConfig {
        /**
         * The type of the item. Possible values are 'row', 'column', 'stack', 'component' and 'react-component'.
         */
        type: string;

        /**
         * An array of configurations for items that will be created as children of this item.
         */
        content?: ItemConfigType[];

        /**
         * The width of this item, relative to the other children of its parent in percent
         */
        width?: number;

        /**
         * The height of this item, relative to the other children of its parent in percent
         */
        height?: number;

        /**
         * A String or an Array of Strings. Used to retrieve the item using item.getItemsById()
         */
        id?: string | string[];

        /**
         * Determines if the item is closable. If false, the x on the items tab will be hidden and container.close()
         * will return false
         * Default: true
         */
        isClosable?: boolean;

        /**
         * The title of the item as displayed on its tab and on popout windows
         * Default: componentName or ''
         */
        title?: string;
    }

    interface ComponentConfig extends ItemConfig {
        /**
         * The name of the component as specified in layout.registerComponent. Mandatory if type is 'component'.
         */
        componentName: string;

        /**
         * A serialisable object. Will be passed to the component constructor function and will be the value returned by
         * container.getState().
         */
        componentState?: any;
    }

    interface ContentItem extends EventEmitter<any> {
        /**
         * This items configuration in its current state
         */
        config: ItemConfigType;

        /**
         * The type of the item. Can be row, column, stack, component or root
         */
        type: string;

        /**
         * An array of items that are children of this item
         */
        contentItems: ContentItem[];

        container: Container;
        /**
         * The item that is this item's parent (or null if the item is root)
         */
        parent: ContentItem;

        /**
         * A String or array of identifiers if provided in the configuration
         */
        id: string;

        /**
         * True if the item had been initialised
         */
        isInitialised: boolean;

        /**
         * True if the item is maximised
         */
        isMaximised: boolean;

        /**
         * True if the item is the layout's root item
         */
        isRoot: boolean;

        /**
         * True if the item is a row
         */
        isRow: boolean;

        /**
         * True if the item is a column
         */
        isColumn: boolean;

        /**
         * True if the item is a stack
         */
        isStack: boolean;

        /**
         * True if the item is a component
         */
        isComponent: boolean;

        /**
         * A reference to the layoutManager that controls this item
         */
        layoutManager: any;

        /**
         * The item's outer element
         */
        element: Container;

        /**
         * The item's inner element. Can be the same as the outer element.
         */
        childElementContainer: Container;

        /**
         * Adds an item as a child to this item. If the item is already a part of a layout it will be removed
         * from its original position before adding it to this item.
         * @param itemOrItemConfig A content item (or tree of content items) or an ItemConfiguration to create the item from
         * @param index last index  An optional index that determines at which position the new item should be added. Default: last index.
         */
        addChild(itemOrItemConfig: ContentItem | ItemConfigType, index?: number): void;

        /**
         * Destroys the item and all it's children
         * @param contentItem The contentItem that should be removed
         * @param keepChild If true the item won't be destroyed. (Use cautiosly, if the item isn't destroyed it's up to you to destroy it later). Default: false.
         */
        removeChild(contentItem: ContentItem, keepChild?: boolean): void;

        /**
         * The contentItem that should be removed
         * @param oldChild    ContentItem The contentItem that should be removed
         * @param newChild A content item (or tree of content items) or an ItemConfiguration to create the item from
         */
        replaceChild(oldChild: ContentItem, newChild: ContentItem | ItemConfigType): void;

        /**
         * Updates the items size. To actually assign a new size from within a component, use container.setSize( width, height )
         */
        setSize(): void;

        /**
         * Sets the item's title to the provided value. Triggers titleChanged and stateChanged events
         * @param title the new title
         */
        setTitle(title: string): void;

        /**
         * A powerful, yet admittedly confusing method to recursively call methods on items in a tree. Usually you wouldn't need
         * to use it directly, but it's used internally to setSizes, destroy parts of the item tree etc.
         * @param functionName The name of the method to invoke
         * @param functionArguments An array of arguments to pass to every function
         * @param bottomUp If true, the method is invoked on the lowest parts of the tree first and then bubbles upwards. Default: false
         * @param skipSelf If true, the method will only be invoked on the item's children, but not on the item itself. Default: false
         */
        callDownwards(functionName: string, functionArguments?: any[], bottomUp?: boolean, skipSelf?: boolean): void;

        /**
         * Emits an event that bubbles up the item tree until it reaches the root element (and after a delay the layout manager). Useful e.g. for indicating state changes.
         */
        emitBubblingEvent(name: string): void;

        /**
         * Convenience method for item.parent.removeChild( item )
         */
        remove(): void;

        /**
         * Maximises the item or minimises it if it's already maximised
         */
        toggleMaximise(): void;

        /**
         * Selects the item. Only relevant if settings.selectionEnabled is set to true
         */
        select(): void;

        /**
         * Unselects the item. Only relevant if settings.selectionEnabled is set to true
         */
        deselect(): void;

        /**
         * Returns true if the item has the specified id or false if not
         * @param id An id to check for
         */
        hasId(id: string): boolean;

        /**
         * Only Stacks have this method! It's the programmatical equivalent of clicking a tab.
         * @param contentItem The new active content item
         */
        setActiveContentItem(contentItem: ContentItem): void;

        /**
         * Only Stacks have this method! Returns the currently selected contentItem.
         */
        getActiveContentItem(): ContentItem;

        /**
         * Adds an id to an item or does nothing if the id is already present
         * @param id The id to be added
         */
        addId(id: string): void;

        /**
         * Removes an id from an item or throws an error if the id couldn't be found
         * @param id The id to be removed
         */
        removeId(id: string): void;

        /**
         * Calls filterFunction recursively for every item in the tree. If the function returns true the item is added to the resulting array
         * @param filterFunction A function that determines whether an item matches certain criteria
         */
        getItemsByFilter(filterFunction: (contentItem: ContentItem) => boolean): ContentItem[];

        /**
         * Returns all items with the specified id.
         * @param id An id specified in the itemConfig
         */
        getItemsById(id: string | string[]): ContentItem[];

        /**
         * Returns all items with the specified type
         * @param type 'row', 'column', 'stack', 'component' or 'root'
         */
        getItemsByType(type: string): ContentItem[];

        /**
         * Returns all instances of the component with the specified componentName
         * @param componentName a componentName as specified in the itemConfig
         */
        getComponentsByName(componentName: string): any;

    }

    interface Header {
        // A reference to the LayoutManager instance
        layoutManager: GoldenLayout;

        // A reference to the Stack this Header belongs to
        parent: any; // TODO

        // An array of the Tabs within this header
        tabs: Tab[];

        // The currently selected activeContentItem
        activeContentItem: any; // TODO

        // The outer (jQuery) DOM element of this Header
        element: JQuery<HTMLElement>;

        // The (jQuery) DOM element containing the tabs
        tabsContainer: JQuery<HTMLElement>;

        // The (jQuery) DOM element containing the close, maximise and popout button
        controlsContainer: JQuery<HTMLElement>;
    }

    interface Tab {
        // True if this tab is the selected tab
        readonly isActive: boolean;

        // A reference to the header this tab is a child of
        header: Header;

        // A reference to the content item this tab relates to
        contentItem: any; // TODO

        // The tabs outer (jQuery) DOM element
        element: JQuery<HTMLElement>;

        // The (jQuery) DOM element containing the title
        titleElement: JQuery<HTMLElement>;

        // The (jQuery) DOM element that closes the tab
        closeElement: JQuery<HTMLElement>;

        /**
         * Sets the tab's title. Does not affect the contentItem's title!
         * @param title The new title
         */
        setTitle(title: string): void;

        /**
         * Sets this tab's active state. To programmatically switch tabs, use header.setActiveContentItem( item ) instead.
         * @param isActive Whether the tab is active
         */
        setActive(isActive: boolean): void;
    }

    interface Container extends EventEmitter<Events.ContainerEvent> {
        // The current width of the container in pixel
        width: number;

        // The current height of the container in pixel
        height: number;

        // A reference to the component-item that controls this container
        parent: any; // TODO

        // A reference to the tab that controls this container. Will initially be null (and populated once a tab event has been fired).
        tab: Tab;

        // The current title of the container
        title: string;

        // A reference to the GoldenLayout instance this container belongs to
        layoutManager: GoldenLayout;

        // True if the item is currently hidden
        isHidden: boolean;

        getElement(): JQuery<HTMLElement>;
    }

    type RegisterCallback = (container: GoldenLayout.Container, state: any) => void;

    type EventCallback = () => void;

    interface LayoutConfig {
        settings?: LayoutConfig.Settings;
        dimensions?: LayoutConfig.Dimensions;
        labels?: LayoutConfig.Labels;
        content?: LayoutConfig.ItemConfig[];
    }

    namespace LayoutConfig {
        interface Settings {
            /** Turns headers on or off. If false, the layout will be displayed with splitters only. @default true */
            hasHeaders?: boolean;

            /** Constrains the area in which items can be dragged to the layout's container. Will be set to false automatically when layout.createDragSource() is called. @default true */
            constrainDragToContainer?: boolean;

            /** If true, the user can re-arrange the layout by dragging items by their tabs to the desired location. @default true */
            reorderEnabled?: boolean;

            /** If true, the user can select items by clicking on their header. This sets the value of layout.selectedItem to the clicked item, highlights its header and the layout emits a 'selectionChanged' event. @default false */
            selectionEnabled?: boolean;

            /** Decides what will be opened in a new window if the user clicks the popout icon. If true the entire stack will be transferred to the new window, if false only the active component will be opened. @default false */
            popoutWholeStack?: boolean;

            /** Specifies if an error is thrown when a popout is blocked by the browser (e.g. by opening it programmatically). If false, the popout call will fail silently. @default true */
            blockedPopoutsThrowError?: boolean;

            /** Specifies if all popouts should be closed when the page that created them is closed. Popouts don't have a strong dependency on their parent and can exist on their own, but can be quite annoying to close by hand. In addition, any changes made to popouts won't be stored after the parent is closed. @default true */
            closePopoutsOnUnload?: boolean;

            /** Specifies if the popout icon should be displayed in the header-bar. @default true */
            showPopoutIcon?: boolean;

            /** Specifies if the maximise icon should be displayed in the header-bar. @default true */
            showMaximiseIcon?: boolean;

            /** Specifies if the close icon should be displayed in the header-bar. @default true */
            showCloseIcon?: boolean;
        }

        interface Dimensions {
            /** The width of the borders between the layout items in pixel. Please note: The actual draggable area is wider than the visible one, making it safe to set this to small values without affecting usability. @default 5 */
            borderWidth?: number;

            /** The minimum height an item can be resized to (in pixel). @default 10 */
            minItemHeight?: number;

            /** The minimum width an item can be resized to (in pixel). @default 10 */
            minItemWidth?: number;

            /** The height of the header elements in pixel. This can be changed, but your theme's header css needs to be adjusted accordingly. @default 20 */
            headerHeight?: number;

            /** The width of the element that appears when an item is dragged (in pixel). @default 300 */
            dragProxyWidth?: number;

            /** The height of the element that appears when an item is dragged (in pixel). @default 200 */
            dragProxyHeight?: number;
        }

        interface Labels {
            /** The tooltip text that appears when hovering over the close icon. @default 'close' */
            close?: string;

            /** The tooltip text that appears when hovering over the maximise icon. @default 'maximise' */
            maximise?: string;

            /** The tooltip text that appears when hovering over the minimise icon. @default 'minimise' */
            minimise?: string;

            /** The tooltip text that appears when hovering over the popout icon. @default 'open in new window' */
            popout?: string;
        }

        interface BaseItemConfig {
            /** The type of the item. Possible values are 'row', 'column', 'stack', 'component' and 'react-component'. */
            type: 'row' | 'column' | 'stack' | 'component' | 'react-component';

            /** An array of configurations for items that will be created as children of this item. */
            content?: ItemConfig[];

            /** The width of this item, relative to the other children of its parent in percent. */
            width?: number;

            /** The height of this item, relative to the other children of its parent in percent. */
            height?: number;

            /** A String or an Array of Strings. Used to retrieve the item using item.getItemsById(). */
            id?: string | string[];

            /** Determines if the item is closable. If false, the x on the items tab will be hidden and container.close() will return false. @default true */
            isClosable?	: boolean;

            /** The title of the item as displayed on its tab and on popout windows. @default componentName | '' */
            title?: string;
        }

        interface ComponentItemConfig extends BaseItemConfig {
            type: 'component';

            /** The name of the component as specified in layout.registerComponent. Mandatory if type is 'component'. */
            componentName: string;

            /** A serialisable object. Will be passed to the component constructor function and will be the value returned by container.getState(). */
            componentState?: any;
        }

        interface StackItemConfig extends BaseItemConfig {
            type: 'stack';

            /** The index of the initially selected tab. */
            activeItemIndex?: number;
        }

        type ItemConfig = ComponentItemConfig | StackItemConfig | BaseItemConfig;
    }

}
