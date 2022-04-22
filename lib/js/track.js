{
    let stacks = [];

    var
        createNewStack = function (name) {
            if (!validateName(name)) throw new Error("invalid name: name can only contain alpha-numeric characters and underscores (also can not be null)");
            name = name.trim();
            if (getStack(name) != null) throw new Error("invalid name: name already in use");
            stacks.push({ name: name, tracks: [] });
        },

        deleteStack = function (name) {
            if (!validateName(name)) throw new Error("invalid name: name can only contain alpha-numeric characters and underscores (also can not be null)");
            name = name.trim();
            for (let ind = 0; ind < stacks.length; ind++) {
                const stack = stacks[ind];
                if (stack.name == name) { stacks = stacks.splice(ind, 1); return true };
            }
            return false;
        },

        track = function (stackName, name, undoFn, ...data) {
            if (!validateName(stackName) || !validateName(name)) throw new Error("invalid name: name can only contain alpha-numeric characters and underscores (also can not be null)");
            if (undoFn == null || typeof undoFn != "function") throw new Error("illegal argument(s): bad lambdas");
            let stack = getStack(stackName.trim());
            if (stack == null) throw new Error("illegal argument(s): no such stack!");
            name = name.trim();
            for (let ind = 0; ind < stack.tracks.length; ind++) {
                const track = stack.tracks[ind];
                if (track.name == name) throw new Error("invalid name: name already in use");
            }
            stack.tracks.push(new Track(name, undoFn, data));
        },

        /** pops the stack(s) provided as a single script separated by names, to the level provided as date, index or track name  */
        popStack = function (stackNames, arg) {
            let nStacks = [];
            if (typeof stackNames != "string" || arg == null) throw new Error("illegal argument(s)")
            let names = stackNames.trim().split(' ');
            for (const ind in names) {
                const name = names[ind]
                if (!validateName(name)) throw new Error("invalid name: name can only contain alpha-numeric characters and underscores (also can not be null)");
                let stack = getStack(name);
                if (stack == null) throw new Error("illegal argument(s): illegal argument(s): no such stack!");
                nStacks.push(stack)
            }


            if (nStacks.length == 0) {
                throw new Error("illegal argument(s): no satisfying stack found");
            } else {
                let hasEffect = false;
                if (arg == null) {
                    for (let ind = 0; ind < nStacks.length; ind++) {
                        const stack = nStacks[ind];
                        pop(stack.name, stack.tracks.length - 1); hasEffect = true;
                    };

                }

                else if (typeof arg == "string") {
                    arg = arg.trim();

                    for (let ind = 0; ind < nStacks.length; ind++) {
                        const stack = nStacks[ind];
                        for (let i = 0; i < stack.tracks.length; i++) {
                            const track = stack.tracks[i];
                            if (track.name = arg) {
                                pop(stack.name, i); hasEffect = true;
                            };
                        }
                    }

                }
                else if (typeof arg == "number") {
                    arg = Math.round(arg);
                    if (arg >= 0) for (let ind = 0; ind < nStacks.length; ind++) {
                        const stack = nStacks[ind];
                        if (arg < stack.tracks.length) {
                            pop(stack.name, arg);
                            hasEffect = true;
                        }
                    }
                } else {
                    let date;
                    try {
                        if (typeof arg.getTime() != "number") throw new Error();
                        date = arg;
                    } catch (error) {
                        return false;
                    }

                    for (let ind = 0; ind < nStacks.length; ind++) {
                        const stack = nStacks[ind];
                        for (let i = 0; i < stack.tracks.length; i++) {
                            const track = stack.tracks[i];
                            if (track.fromDate(date) > 0) {
                                if (i == 0) pop(stack.name, i); else pop(stack.name, i - 1);
                                hasEffect = true;
                            }
                        }
                    }
                }
                if (hasEffect) return true;
                return false;
            }
        },

        /** returns the size of the stack or -1 if no such stack found */
        getStackSize = function (name) {
            if (name == null || typeof name != "string") throw new Error("illegal argument(s)")
            let stack = getStack(name.trim())
            if (stack == null) return -1;
            return stack.tracks.length;
        },

        getStackNo = function () {
            return stacks.length;
        },

        getStackNames = function () {
            let stackNames = [];
            for (let ind = 0; ind < stacks.length; ind++) {
                const stack = stacks[ind];
                stackNames.push(stack.name);
            }
            return stackNames;
        }

    let
        validateName = function (name) {
            if (name == null || typeof (name) != "string" || name == "") return false;
            name = name.trim();
            for (let ind = 0; ind < name.length; ind++) {
                const ch = name.charCodeAt(ind);
                if ((ch < 48 || ch > 57) && (ch < 64 || ch > 90) && (ch < 96 || ch > 132) && (ch != '_'.charCodeAt(0))) return false;
            }
            return true;
        },

        getStack = function (name) {
            for (let ind = 0; ind < stacks.length; ind++) {
                const stack = stacks[ind];
                if (stack.name = name) return stack;
            }
            return null;
        },

        pop = function (stackName, trackInd) {
            let tracks = getStack(stackName).tracks;
            let ind = tracks.length - 1;
            while (ind >= trackInd) {
                tracks[ind].undo();
                ind--
            }
            tracks = tracks.splice(trackInd, tracks.length - trackInd);
        };


    class Track {
        constructor(name, undoFn, ...data) {
            this.name = name;
            this.undoFn = undoFn;
            this.data = data;
            this.tracked = new Date();
        }

        undo() {
            this.undoFn(this.data);
        }
        /** return date - tracked date in milliseconds*/
        fromDate(date) {
            return this.tracked.getTime() - date.getTime();
        }
    }
}
