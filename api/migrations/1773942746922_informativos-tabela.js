/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
export const shorthands = undefined;

export const up = (pgm) => {
  pgm.createTable('informativos', {
    id: 'id',
    titulo: { type: 'varchar(255)', notNull: true },
    descricao: { type: 'text', notNull: true },
    data: { type: 'date', notNull: true },
    created_at: {
      type: 'timestamp',
      default: pgm.func('current_timestamp'),
    },
    updated_at: {
      type: 'timestamp',
      default: pgm.func('current_timestamp'),
    },
  });
};

export const down = (pgm) => {
  pgm.dropTable('informativos');
};
