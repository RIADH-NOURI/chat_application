import { OAuth2Client } from 'google-auth-library';
import {config} from 'dotenv';

config();

export const client = new OAuth2Client(process.env.CLIENT_ID);