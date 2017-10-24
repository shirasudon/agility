import { CreateGroupModal, mapSelectedUsersToChipData, } from './CreateGroupModal'

describe("mapSelectedUsersToChipData", () => {
    it("maps list of usernames to data compatible wth Chip", () => {
        const usernames = ['Mary', 'James', 'John']
        const chipData = mapSelectedUsersToChipData(usernames)
        const expected = [
            {
                label: 'Mary',
                key: 0,
            },
            {
                label: 'James',
                key: 1,
            },
            {
                label: 'John',
                key: 2,
            }
        ]
        expect(chipData).toEqual(expected)
    })
})
