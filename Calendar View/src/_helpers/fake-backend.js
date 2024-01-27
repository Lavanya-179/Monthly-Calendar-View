export { fakeBackend };

function fakeBackend() {
    const sd = window.localStorage.getItem("events");
    let events = sd
        ? JSON.parse(sd)
        : [
              {
                  id: 0,
                  title: "All Day Event very long title",
                  allDay: true,
                  start: "2024-02-01T00:00:00.000Z",
                  end: "2024-02-02T00:00:00.000Z",
                  creator: "lavanya",
              },
              {
                  id: 1,
                  title: "Board Meeting",
                  start: "2024-01-29T14:00:00.000Z",
                  end: "2024-01-29T16:00:00.000Z",
              },
          ];

    function getDataFromStorage() {
        const d = window.localStorage.getItem("events");
        if (d) {
            return JSON.parse(d);
        }
        return [...events];
    }
    function setDataInStorage(d) {
        window.localStorage.setItem("events", JSON.stringify(d));
    }
    setDataInStorage(events);
    let realFetch = window.fetch;
    window.fetch = function (url, opts) {
        return new Promise((resolve, reject) => {
            // wrap in timeout to simulate server api call
            setTimeout(handleRoute, 500);

            function handleRoute() {
                switch (true) {
                    case url.endsWith("/events/update") &&
                        opts.method === "POST":
                        return updateEvents();
                    case url.endsWith("/events/delete") &&
                        opts.method === "DELETE":
                        return deleteEvents();
                    case url.endsWith("/events/create") &&
                        opts.method === "POST":
                        return createEvents();
                    case url.endsWith("/events") && opts.method === "GET":
                        return getEvents();
                    default:
                        // pass through any requests not handled above
                        return realFetch(url, opts)
                            .then((response) => resolve(response))
                            .catch((error) => reject(error));
                }
            }

            // Rest API route functions

            function createEvents() {
                const event = body();
                const updatedEvents = [...events, event];
                console.log("updatedEvents: ", event);
                setDataInStorage([...updatedEvents]);
                events = [...updatedEvents];
                return ok({
                    status: "Event successfully updated",
                });
            }

            function updateEvents() {
                const { event } = body();
                const d = getDataFromStorage();
                const updatedEvents = d.map((e) => {
                    console.log(`${e.id} = ${event.id}`, e.id === event.id);
                    return e.id === event.id ? { ...event } : e;
                });
                setDataInStorage([...updatedEvents]);
                events = getDataFromStorage();
                return ok({
                    status: "Event successfully updated",
                });
            }

            function deleteEvents() {
                const { id } = body();
                const d = getDataFromStorage();
                const updatedEvents = d.filter((e) => e.id !== id);
                setDataInStorage([...updatedEvents]);
                console.log("id: ", id);
                console.log("updatedEvents: ", updatedEvents);
                events = [...updatedEvents];
                return ok({
                    status: "Event successfully deleted",
                });
            }

            function getEvents() {
                return ok(getDataFromStorage());
            }

            // helper functions

            function ok(body) {
                resolve({
                    ok: true,
                    text: () => Promise.resolve(JSON.stringify(body)),
                });
            }

            function body() {
                return opts.body && JSON.parse(opts.body);
            }
        });
    };
}
