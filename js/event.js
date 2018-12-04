(function (global) {

    let eventHandler = {

        on: function (eventName, handler, context) {

            if (!eventName) return false;

            this._events || (this._events = {});

            let events = this._events[eventName] || (this._events[eventName] = []);

            events.push({
                callback: handler,
                context: context || this
            });

        },

        fire: function (eventName) {

            if (!eventName) return;

            let args = [].slice.call(arguments,1);

            this._events || (this._events = {});

            let events = this._events[eventName] || (this._events[eventName] = []);

            events.forEach( ({ callback,context }) => {

                callback.apply(context,args);

            });

        }

    }

    global.eventHandler = eventHandler;

})(window);