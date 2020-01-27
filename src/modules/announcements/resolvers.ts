import { query } from '../../db/fns'

const announcements =  async () => {
        const response = await query(['SELECT * FROM announcements WHERE deleted_at IS NULL;']);
        console.log('fetchAnnouncementItems: ', response[0]);
        return response[0]
};

const deleteAnnouncementById =  async (_: any, args: any) => {
    try {
        const response = await query([`UPDATE announcements SET deleted_at=CURRENT_TIMESTAMP WHERE id = ${args.id};`]);
        console.log('deleteAnnouncementById: ', response[0]);
        return response[0]
    }  catch ({ message }) {
        console.error(message);
        return { message }
    }
};

const getAnnouncementsById =  async (_: any, args: any) => {
    try {
        const response = await query([`SELECT * FROM announcements WHERE author = "${args.username}" AND deleted_at IS NULL ;`]);
        console.log('getAnnouncementsById: ', response[0]);
        return response[0]
    }  catch ({ message }) {
        console.error(message);
        return { message }
    }
};

const createAnnouncement = async (_: any, args: any) => {
    try {
        // date: String, text: String, is_urgent: Boolean, username: String
        const { text, is_urgent, username } = args;
        console.log('createAnnouncement: ', text, is_urgent, username);

        const fields = [`"${text}"`, `${is_urgent}`, `"${username}"`];
        const response = await query([
            `INSERT INTO announcements (text, is_urgent, author) VALUES (${fields.join(',')});`,
            'COMMIT;',
        ]);
        console.log('createAnnouncement response: ', response);
        // TO-DO: add to user_news table too
        return { message: 'success!' }
    } catch ({ message }) {
        console.error(message);
        return { message }
    }
};

const updateAnnouncement = async (_: any, args: any) => {
    try {
        // date: String, text: String, is_urgent: Boolean, username: String
        const { id, text, is_urgent, username } = args;
        console.log('updateAnnouncement: ', text, is_urgent, username);
        const response = await query([
            `UPDATE announcements SET text="${text}", is_urgent=${is_urgent}, author="${username}" WHERE id = ${id};`,
            'COMMIT;',
        ]);
        console.log('updateAnnouncement response: ', response);
        // TO-DO: add to user_news table too
        return { message: 'success!' }
    } catch ({ message }) {
        console.error(message);
        return { message }
    }
};

export default {
  Query: {
    announcements,
    getAnnouncementsById
  },
  Mutation: {
    createAnnouncement,
    deleteAnnouncementById,
    updateAnnouncement
  }
}
