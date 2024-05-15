import { Role } from 'src/app/models/role-model';


export const defaultRoutes = {
    0:'/',
    [Role.user]: '/tabs/my-requests',
    [Role.hrAdmin]: '/tabs/pending-requests',
};
