import { 
    DataTypes, 
    Model,
    Relationships 
} from './deps.ts';

export class PageModel extends Model {
    static table = 'dc_pages';

    static fields = {
        id: {
            type: DataTypes.UUID,
            primaryKey: true
        },
        route: DataTypes.STRING,
        public: DataTypes.BOOLEAN
    };

    static pageContents() {
        return this.hasMany(PageContentModel);
    }
}

export class PageContentModel extends Model {
    static table = 'dc_pageContents';

    static fields = {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        published: {
            type: DataTypes.DATETIME,
            allowNull: true
        },
        pageId: Relationships.belongsTo(PageModel),
        content: DataTypes.STRING,
        type: DataTypes.enum(['markdown', 'template']),
    };

    static page() {
        return this.hasOne(PageModel);
    }
}
  