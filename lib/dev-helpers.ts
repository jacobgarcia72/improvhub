import { Role, Team, User } from "@/types";
import { getAllUsersAbbreviated, saveUser } from "./users";
import { respondToTeamInvitation, saveTeam } from "./teams";
import nameGenerator from "./name-generator";
import slugify from 'slugify';
import { getRandomElements, removeLeadingArticles } from "./helper-functions";
import crypto from "node:crypto";

const rnd = (top: number = 100) => Math.floor(Math.random() * top) + 1;
const getBoyName = (): string => {
    const names = ["Michael", "Christopher", "Matthew", "Joshua", "Jacob", "Nicholas", "Andrew", "Daniel", "Tyler", "Joseph", "Brandon", "David", "James", "Ryan", "John", "Zachary", "Justin", "William", "Anthony", "Robert", "Jonathan", "Austin", "Alexander", "Kyle", "Kevin", "Thomas", "Cody", "Jordan", "Eric", "Benjamin", "Aaron", "Christian", "Samuel", "Dylan", "Steven", "Brian", "Jose", "Timothy", "Nathan", "Adam", "Richard", "Patrick", "Charles", "Sean", "Jason", "Cameron", "Jeremy", "Mark", "Stephen", "Jesse", "Juan", "Alex", "Travis", "Jeffrey", "Ethan", "Caleb", "Luis", "Jared", "Logan", "Hunter", "Trevor", "Bryan", "Evan", "Paul", "Taylor", "Kenneth", "Connor", "Dustin", "Noah", "Carlos", "Devin", "Gabriel", "Ian", "Adrian", "Shane", "Peter", "Vincent", "Lucas", "Jack", "Tanner", "Angel", "Isaiah", "Dalton", "Brett", "George", "Alejandro", "Elijah", "Cory", "Cole", "Joel", "Erik", "Jake", "Mason", "Jorge", "Dillon", "Raymond", "Colton", "Ricardo"];
    return names[rnd(names.length - 1)];
}
const getGirlName = (): string => {
    const names = ["Jessica", "Ashley", "Emily", "Sarah", "Samantha", "Amanda", "Brittany", "Elizabeth", "Taylor", "Megan", "Hannah", "Kayla", "Lauren", "Stephanie", "Rachel", "Jennifer", "Nicole", "Alexis", "Victoria", "Amber", "Alyssa", "Courtney", "Rebecca", "Danielle", "Erin", "Heather", "Melissa", "Madison", "Morgan", "Brianna", "Christina", "Katherine", "Kristen", "Laura", "Allison", "Haley", "Molly", "Kathryn", "Mary", "Anna", "Natalie", "Michelle", "Sabrina", "Jacqueline", "Kelsey", "Tiffany", "Sydney", "Chelsea", "Jasmine", "Brooke", "Grace", "Olivia", "Savannah", "Alexandra", "Lindsey", "Christine", "Paige", "Sara", "Vanessa", "Maria", "Monica", "Caitlin", "Erica", "Leah", "Cassandra", "Gabrielle", "Jordan", "Autumn", "Destiny", "Leslie", "Ariana", "Shelby", "Julia", "Abigail", "Shannon", "Katelyn", "Angela", "Kristin", "Jenna", "Andrea", "Catherine", "Emma", "Alicia", "Mackenzie", "Mariah", "Cheyenne", "Miranda", "Tara", "Whitney", "Brittney", "Amy", "Kara", "Veronica", "Desiree", "Kristina", "Bailey", "Breanna", "Karen", "Katie", "Kiara"];
    return names[rnd(names.length - 1)];
}
const getLastName = (): string => {
    const names = ["Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Rodriguez", "Martinez", "Hernandez", "Lopez", "Gonzalez", "Wilson", "Anderson", "Thomas", "Taylor", "Moore", "Jackson", "Martin", "Lee", "Perez", "Thompson", "White", "Harris", "Sanchez", "Clark", "Ramirez", "Lewis", "Robinson", "Walker", "Young", "Allen", "King", "Wright", "Scott", "Torres", "Nguyen", "Hill", "Flores", "Green", "Adams", "Nelson", "Baker", "Hall", "Rivera", "Campbell", "Mitchell", "Carter", "Roberts", "Gomez", "Phillips", "Evans", "Turner", "Diaz", "Parker", "Cruz", "Edwards", "Collins", "Reyes", "Stewart", "Morris", "Morales", "Murphy", "Cook", "Rogers", "Gutierrez", "Ortiz", "Morgan", "Cooper", "Peterson", "Bailey", "Reed", "Kelly", "Howard", "Ramos", "Kim", "Cox", "Ward", "Richardson", "Watson", "Brooks", "Chavez", "Wood", "James", "Bennett", "Gray", "Mendoza", "Ruiz", "Hughes", "Price", "Alvarez", "Castillo", "Sanders", "Patel", "Myers", "Long", "Ross", "Foster", "Jimenez"];
    return names[rnd(names.length - 1)];
}
const getLoremIpsum = (chars: number): string => 'Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque faucibus ex sapien vitae pellentesque sem placerat. In id cursus mi pretium tellus duis convallis. Tempus leo eu aenean sed diam urna tempor. Pulvinar vivamus fringilla lacus nec metus bibendum egestas. Iaculis massa nisl malesuada lacinia integer nunc posuere. Ut hendrerit semper vel class aptent taciti sociosqu. Ad litora torquent per conubia nostra inceptos himenaeos. Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque faucibus ex sapien vitae pellentesque sem placerat. In id cursus mi pretium tellus duis convallis. Tempus leo eu aenean sed diam urna tempor. Pulvinar vivamus fringilla lacus nec metus bibendum egestas. Iaculis massa nisl malesuada lacinia integer nunc posuere. Ut hendrerit semper vel class aptent taciti sociosqu. Ad litora torquent per conubia nostra inceptos himenaeos.'.slice(0, chars);

const generateUserAndRoles = (count: number): [User, { [role: string]: boolean }] => {
    const id = `test-${count}`;

    const images = {
        male: [
            'https://res.cloudinary.com/dojkqkskx/image/upload/v1781117759/ed82d7ed277f4e9b179708b3d732b232_fjtzd9.jpg',
            'https://res.cloudinary.com/dojkqkskx/image/upload/v1781117758/360_F_327794038_qHFSUF20HJpcQwmdk3a7QhTltap4iisP_c6pslw.jpg',
            'https://res.cloudinary.com/dojkqkskx/image/upload/v1781117758/5893806532981c262ab8cb3bcb171591_gbutkw.jpg',
            'https://res.cloudinary.com/dojkqkskx/image/upload/v1781117757/selfie-sunday-58-years-old-not-the-best-picture-v0-0vj231t6os6b1_wxv6qk.jpg',
            'https://res.cloudinary.com/dojkqkskx/image/upload/v1781117757/depositphotos_664624560-stock-photo-vertical-selfie-portrait-young-african_xttu6p.jpg',
            'https://res.cloudinary.com/dojkqkskx/image/upload/v1781117755/98c86590ecbd01b8eeba712290595ff7_hui1jw.jpg',
            'https://res.cloudinary.com/dojkqkskx/image/upload/v1781117755/photo-1695927621677-ec96e048dce2_ofeeds.jpg',
            'https://res.cloudinary.com/dojkqkskx/image/upload/v1781118914/Bailey_20Binder_20and_20Bodhi_ckj83p.jpg',
            'https://res.cloudinary.com/dojkqkskx/image/upload/v1781120454/Davis-McCombsc-Carolyn-Guinzio_lntnil.jpg',
            'https://res.cloudinary.com/dojkqkskx/image/upload/v1781120709/jeffrey-hipolito-austin-tx-obituary.jpg_gx96iu.jpg',
            'https://res.cloudinary.com/dojkqkskx/image/upload/v1781120710/Hausman-main-page-1_e2xne2.jpg',
            'https://res.cloudinary.com/dojkqkskx/image/upload/v1781120711/ddaf831c-546b-4e19-9084-5ba6b236e5cc_v5ycjk.jpg',
            'https://res.cloudinary.com/dojkqkskx/image/upload/v1781120710/ee1a14a3-e80e-4f49-b03f-92b7f2873efd_vebwnc.jpg',
            'https://res.cloudinary.com/dojkqkskx/image/upload/v1781120710/39727_900_v52itl.jpg',
            'https://res.cloudinary.com/dojkqkskx/image/upload/v1781120711/3454780a-1da0-42b7-b04d-3f5793600b52_ggeyoy.webp',
            'https://res.cloudinary.com/dojkqkskx/image/upload/v1781120713/andrew-alves-austin-tx-obituary_f6pglz.jpg',
            'https://res.cloudinary.com/dojkqkskx/image/upload/v1781120715/profilepic_qjsczs.jpg'
        ],
        female: [
            'https://res.cloudinary.com/dojkqkskx/image/upload/v1781117759/6O9tbyl4QvSYxFzmSIJwrg_cq63cj.webp',
            'https://res.cloudinary.com/dojkqkskx/image/upload/v1781117757/portrait-smiling-young-woman-taking-selfie-park_23-2148027178_sti207.jpg',
            'https://res.cloudinary.com/dojkqkskx/image/upload/v1781117756/0B692EB6-3887-4570-8E78-4CF10B9DA79E-e1667568341238_ikj0xr.jpg',
            'https://res.cloudinary.com/dojkqkskx/image/upload/v1781117756/selfie-old-lady-skincare-40-y-o-just-started-taking-better-v0-5h8d107kkux01_swqxj5.jpg',
            'https://res.cloudinary.com/dojkqkskx/image/upload/v1781117755/vertical-photo-asian-thai-woman-600nw-2622906163_ubjdb9.jpg',
            'https://res.cloudinary.com/dojkqkskx/image/upload/v1781117755/360_F_545067217_r6FePteKU4pn1A237c6LUTxykCsVhAce_kbidxc.jpg',
            'https://res.cloudinary.com/dojkqkskx/image/upload/v1781117755/photo_z4cihg.jpg',
            'https://res.cloudinary.com/dojkqkskx/image/upload/v1781118914/blancapadilla_8753cd756bbfbfd6b0b5_1_1200x.progressive_mstuee.jpg',
            'https://res.cloudinary.com/dojkqkskx/image/upload/v1781120454/b8d4ee5b-7dbf-4a83-8317-1980840e30be-RAPID_5_MORPC_BJP_02_fwtw8i.jpg',
            'https://res.cloudinary.com/dojkqkskx/image/upload/v1781120711/women-ready-laser-dental-treatments-at-blunn-creek-family-dentistry-in-austin-tx_lh6kjk.jpg',
            'https://res.cloudinary.com/dojkqkskx/image/upload/v1781120712/mbFkAYdlELtjdwnJa11UlZikGwcNiFpF_zjt5z9.jpg',
            'https://res.cloudinary.com/dojkqkskx/image/upload/v1781120712/l_9733cdda8af3e4ebf32dab9e56b29908_wxrab7.jpg',
            'https://res.cloudinary.com/dojkqkskx/image/upload/v1781120713/IMG_3173_mt8xov.jpg',
            'https://res.cloudinary.com/dojkqkskx/image/upload/v1781120713/alyssa-robinson-austin-tx-obituary.jpg_rhresw.jpg',
            'https://res.cloudinary.com/dojkqkskx/image/upload/v1781120714/Lauren-Briere-Selfie-Robots-in-Rowboats-Austin-tx-Artist-1_exldap.jpg',
            'https://res.cloudinary.com/dojkqkskx/image/upload/v1781120715/26211aa3-be4a-4c30-9e56-ef4bbdf029b7_wnrf84.jpg',
            'https://res.cloudinary.com/dojkqkskx/image/upload/v1781120956/happy-selfie-owner-two-dogs-car-woman-smiles-selfie-two-dogs-car-both-large-brindle-395885731_rodtg6.jpg',
        ]
    }
    const lastName = getLastName();
    let firstName: string;
    let pronouns: string | undefined;
    let image: string | undefined;
    if (rnd() <= 50) {
        firstName = getBoyName();
        if (rnd() <= 80) pronouns = 'he/him';
        if (rnd() <= 95) image = images.male[rnd(images.male.length - 1)];
    } else {
        firstName = getGirlName();
        if (rnd() <= 80) pronouns = 'she/her';
        if (rnd() <= 95) image = images.female[rnd(images.female.length - 1)]
    }
    const bio = rnd() <= 60 ? getLoremIpsum(5 + rnd(870)) : undefined;

    let city: string | undefined;
    let state: string | undefined;
    const theatres: string[] = [];
    const rndLocation = rnd();
    if (rndLocation <= 45) {
        if (rnd() <= 85) {
            city = 'Pittsburgh';
            state = 'PA';
        }
        ['Arcade Comedy Theater', 'Steel City Improv Theater', 'Glitterbox']
            .forEach((theatre) => {
                if (rnd() <= 60) theatres.push(theatre);
            });
    } else if (rndLocation <= 45) {
        if (rnd() <= 85) {
            city = 'Austin';
            state = 'TX';
        }
        ['The Hideout Theatre', 'ColdTowne Theater', 'Fallout Theater', 'ComedySportz Austin']
            .forEach((theatre) => {
                if (rnd() <= 60) theatres.push(theatre);
            });
    } else {
        if (rnd() <= 85) {
            city = 'Round Rock';
            state = 'TX';
        }
        ['The Hideout Theatre', 'ColdTowne Theater', 'Fallout Theater', 'ComedySportz Austin']
            .forEach((theatre) => {
                if (rnd() <= 60) theatres.push(theatre);
            });
    }

    const website = rnd() <= 15 ? 'https://github.com/jacobgarcia72' : undefined;

    const roles: { [role: string]: boolean } = {
        player: false,
        tech: false,
        director: false,
        musician: false,
        coach: false
    };
    let openToJoinTeam = rnd() <= 10;
    let openToAccompanyTeam = rnd() <= 2;
    let openToCoachTeam = rnd() <= 5;
    if (rnd() <= 95) {
        roles.player = true;
        openToJoinTeam = rnd() <= 50;
    }
    if (rnd() <= 30) {
        roles.tech = true;
    }
    if (rnd() <= 20) {
        roles.director = true;
    }
    if (rnd() <= 10) {
        roles.musician = true;
        openToAccompanyTeam = rnd() <= 80;
    }
    if (rnd() <= 15) {
        roles.coach = true;
        openToCoachTeam = rnd() <= 90;
    }
    const joinDate = new Date().toISOString();
    return [
        {
            id, joinDate, firstName, lastName, pronouns, bio, theatres, city, state, website, image, openToJoinTeam, openToAccompanyTeam, openToCoachTeam
        },
        roles
    ]
}

// const generateShow = (users: { name: string, id: string, image?: string }[]) => {
//     const creatorId = users[rnd(users.length - 1)].id;
//     const admins = [creatorId];
// }

const generateTeam = (users: { name: string, id: string, image?: string }[]): [team: Team, members: { name: string, id: string | null, role: Role }[]] => {
    const name = nameGenerator();
    let city: string | null = null;
    let state: string | null = null;
    const theatres: string[] = [];
    const rndLocation = rnd();
    if (rndLocation <= 50) {
        if (rnd() <= 95) {
            city = 'Pittsburgh';
            state = 'PA';
        }
        ['Arcade Comedy Theater', 'Steel City Improv Theater', 'Glitterbox']
            .forEach((theatre) => {
                if (rnd() <= 80) theatres.push(theatre);
            });
    } else {
        if (rnd() <= 95) {
            city = 'Austin';
            state = 'TX';
        }
        ['The Hideout Theatre', 'ColdTowne Theater', 'Fallout Theater', 'ComedySportz Austin']
            .forEach((theatre) => {
                if (rnd() <= 70) theatres.push(theatre);
            });
    }
    const players = getRandomElements(users, rnd(20))
        .map(({ name, id }) => ({
            name,
            id: rnd() <= 80 ? id : null,
            role: 'player' as Role
        }))
    let coaches: { name: string, id: string | null, role: Role }[] = [];
    if (rnd() <= 80) {
        const numOfCoaches = rnd() <= 95 ? 1 : 2;
        coaches = getRandomElements(users, numOfCoaches)
            .map(({ name, id }) => ({
                name: name,
                id: rnd() <= 80 ? id : null,
                role: 'coach' as Role
            }))
    }
    let musicians: { name: string, id: string | null, role: Role }[] = [];
    if (rnd() <= 10) {
        const numOfMusicians = rnd() <= 85 ? 1 : 2;
        musicians = getRandomElements(users, numOfMusicians)
            .map(({ name, id }) => ({
                name,
                id: rnd() <= 80 ? id : null,
                role: 'musician' as Role
            }))
    }
    const images = [
        'https://res.cloudinary.com/dojkqkskx/image/upload/v1781129292/vertical-group-of-happy-friends-posing-for-a-selfie-on-a-spring-day-as-they-party-together_cjsrrt.jpg',
        'https://res.cloudinary.com/dojkqkskx/image/upload/v1781129292/4f20807aef016ec3efd46b38a554451e_tgw05d.jpg',
        'https://res.cloudinary.com/dojkqkskx/image/upload/v1781129108/young-men-in-casual-clothes-are-talking-laughing-and-drinking-while-sitting-at-bar-counter-in-pub-photo_abhnum.jpg',
        'https://res.cloudinary.com/dojkqkskx/image/upload/v1781129108/Depositphotos_252922046_L_c4sr4n.jpg',
        'https://res.cloudinary.com/dojkqkskx/image/upload/v1781129033/Improv_147_wv7yph_cgfhis.jpg',
        'https://res.cloudinary.com/dojkqkskx/image/upload/v1781129032/Indian-Improv-4_bmqmtv.jpg',
        'https://res.cloudinary.com/dojkqkskx/image/upload/v1781129031/Third-Coast-Comedy-Improv-Show-JbHs_normal-w_500-h_0-force_webp_jugdae.webp',
        'https://res.cloudinary.com/dojkqkskx/image/upload/v1781129029/2813_dktzfx.jpg',
        'https://res.cloudinary.com/dojkqkskx/image/upload/v1781129029/F137DBC0-5572-4C32-8D38-D76BF8B6EFD6_qpuv7i.jpg',
        'https://res.cloudinary.com/dojkqkskx/image/upload/v1781128924/naassom-azevedo-Q_Sei-TqSlc-unsplash-scaled-e1620140117111_gr1n9d.jpg',
        'https://res.cloudinary.com/dojkqkskx/image/upload/v1781128643/Teen_2BImprov_2B2_bofaz0.webp',
        'https://res.cloudinary.com/dojkqkskx/image/upload/v1781128643/dsc-1301_orig_zycqma.jpg',
        'https://res.cloudinary.com/dojkqkskx/image/upload/v1781128642/ghows-OH-b2c9f5c7-d717-4480-a2f8-78d5ef68b6b0-cf4f89b1_vyjh51.jpg',
        'https://res.cloudinary.com/dojkqkskx/image/upload/v1781128642/90_zxfod3.jpg',
    ];
    const team: Team = {
        name,
        id: slugify(removeLeadingArticles(name), { lower: true, trim: true }),
        photoCredit: rnd() <= 20 ? `${rnd() <= 50 ? getGirlName() : getBoyName()} ${getLastName()}` : null,
        city, state, theatres,
        lookingForPlayers: true, // rnd() < (295 / (players.length * 2 + 1)),
        lookingForMusician: true, // rnd() <= 10,
        lookingForCoach: true, // rnd() <= (coaches.length ? 5 : 75),
        description: rnd() <= 35 ? getLoremIpsum(rnd(200) + 15) : null,
        image: rnd() <= 90 ? images[rnd(images.length - 1)] : null
    }
    return [team, [ ...players, ...musicians, ...coaches ]]
}

export const generateDummyUsers = async (amount: number = 100) => {
    const userCount = (await getAllUsersAbbreviated()).length;
    for (let i = userCount; i <= userCount + amount; i++) {
        const [user, roles] = generateUserAndRoles(i);
        await saveUser(user, crypto.randomUUID(), roles);
    }
}

export const generateDummyTeams = async (amount: number = 100) => {
    const users = await getAllUsersAbbreviated();
    for (let i = 1; i <= amount; i++) {
        const [team, members] = generateTeam(users);
        console.log('team ' + i, team)
        console.log('members', members)
        await saveTeam(team, members);
        for (let i = 0; i < members.length; i++) {
            const member = members[i];
            if (member.id && rnd() <= 80) {
                await respondToTeamInvitation(team.id, member.id, member.role, true);
            }
        }
    }
}
