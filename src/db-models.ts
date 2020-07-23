import { 
    DataTypes, 
    Model
} from './deps.ts';

export class Pages extends Model {
    static table = 'dc_pages';
    static timestamps = true;

    static fields = {
        id: {
            type: DataTypes.UUID,
            primaryKey: true
        },
        route: {
            type: DataTypes.STRING,
            unique: true,
        },
        title: DataTypes.STRING,
        style: DataTypes.enum(['default', 'landing']),
        content: {
            type: DataTypes.STRING,
            length: 10240,
            allowNull: true
        },
        type: DataTypes.enum(['markdown', 'template']),
        published: {
            type: DataTypes.DATETIME,
            allowNull: true
        }  
    };
}

