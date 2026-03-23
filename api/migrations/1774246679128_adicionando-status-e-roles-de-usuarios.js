/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
export const shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const up = (pgm) => {
  // criar enums no banco
  pgm.createType('user_status', ['ACTIVE', 'INACTIVE']);
  pgm.createType('user_role', ['HUMAN', 'DIVINE']);

  // adicionar colunas
  pgm.addColumns('users', {
    status: {
      type: 'user_status',
      notNull: true,
      default: 'INACTIVE',
    },
    role: {
      type: 'user_role',
      notNull: true,
      default: 'HUMAN',
    },
  });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
  pgm.dropColumns('users', ['status', 'role']);

  pgm.dropType('user_status');
  pgm.dropType('user_role');
};
