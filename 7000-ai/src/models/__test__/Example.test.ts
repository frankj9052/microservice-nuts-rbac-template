import { Example } from "../Example"

it("implements optimistic concurrency control", async () => {
    // Create an instance of a ticket
    const example = Example.build({
        text: "fack text",
        userId: "test user"
    })
    // Save the ticket to the database
    await example.save()

    // Fetch the ticket twice
    const firstInstance = await Example.findById(example.id)
    const secondInstance = await Example.findById(example.id)

    // Make two separate changes to the tickets we fetched
    firstInstance!.set({text: "10"})
    secondInstance!.set({text: "20"})

    // save the first fetched ticket expect an success
    await firstInstance!.save()

    // save the second ticket and expect an error(version outage)
    try {
        await secondInstance!.save()
    } catch (err) {
        return;
    }
    throw new Error("Should not reach this point")
})

it("increments the version number on multiple saves", async() => {
    // Create an instance of a ticket
    const example = Example.build({
        text: "fack text",
        userId: "test user"
    })
    // Save the ticket to the database
    await example.save()
    
    expect(example.version).toEqual(0)

    // pertend we update the ticket
    await example.save()

    // check the version
    expect(example.version).toEqual(1)
})