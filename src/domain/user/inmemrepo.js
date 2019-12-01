class Repo {
    constructor(defaultValues) {
        this.inner = defaultValues || {};
        this.nextId = 10000;
    }

    byId(id) {
        return this.inner[id];
    }

    save(newEntity) {
        if (newEntity.id === undefined) {
            newEntity.id = this.nextId;
            this.inner[this.nextId] = newEntity;
            this.nextId++;
            return newEntity;
        }
        this.inner[newEntity.id] = newEntity;
        return newEntity;
    }
}

module.exports = Repo;