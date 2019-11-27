const fs = require('fs');
const fspath = require('path');

class DB {
    constructor(file, timeout=100, empty={}) {
        this.data = empty;
        if (!fspath.isAbsolute(file)) {
            file = fspath.join(fspath.dirname(__filename), file);
        }
        this.file = file;
        this.changed = false;
        this.timeout = timeout;
        if (fs.existsSync(file)) {
            this.data = JSON.parse(fs.readFileSync(file).toString());
        } else {
            this.data = empty;
            this.write();
        }
        setTimeout(this.daemon.bind(this), this.timeout);
    }

    daemon() {
        if (this.changed === true) {
            this.write();
            this.changed = false;
        }
        setTimeout(this.daemon.bind(this), this.timeout);
    }

    write() {
        fs.writeFileSync(this.file, JSON.stringify(this.data, null, 4));
    }
}
