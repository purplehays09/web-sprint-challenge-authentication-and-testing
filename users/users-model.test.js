const User = require('./users-model')
const db = require('../database/dbConfig.js');
const { default: expectCt } = require('helmet/dist/middlewares/expect-ct');

beforeEach(async () => {
    await db('users').truncate()
})

const doug = {username:"Doug", password:"guest"}
const archer = {username:"Archer", password:"guest"}

describe('users model', () => {
    describe('find()', () => {
        it('returns an empty array', async () => {
            const users = await User.getAll()
            // console.log("THIS IS THE RESULT OF USERS ===>",users)
            expect(users).toHaveLength(0)
        });
        it('gets all the users', async () => {
            await db('users').insert(doug)

            let users = await User.getAll()

            expect(users).toHaveLength(1)
        });
        
    });

    describe('add(user)', () => {
        it('can add a user', async () => {
            await User.add(doug)
            let users = await db('users')
            expect(users).toHaveLength(1)
        });
        
    });

    describe('findById', () => {
        it('can find a user by Id', async() => {
            await db('users').insert(doug)

            const dougTest = await User.findById(1)
            expect(dougTest).toMatchSnapshot()
        });
        
    });
    
    
    
});

