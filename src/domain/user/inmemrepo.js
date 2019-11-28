class Repo {
    constructor(defaultValues) {
        this.inner = defaultValues || {};
        this.nextId = 10000;
    }

    byId(id) {
        return this.inner[id];
    }

    save(newEntity) {
        newEntity.id = this.nextId;
        this.inner[this.nextId] = newEntity;
        this.nextId ++;
        return newEntity;
    }
}

module.exports = Repo;