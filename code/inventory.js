let myObj = {
    someVariable: 2,
    another: true,
    myFunction: () => {},
    self: this, // why not make self object avaliable
    myOtherObject: {
        // nested object, so if I called "this" it means "myOtherObject"
        // rather than "myObj"
        someMoreVariables: 5,
        func: () => {
            // grab outside variables and functions
            log(self.another) // prints true
            log(self.myFunction()) // call ur function
        }
    }
}