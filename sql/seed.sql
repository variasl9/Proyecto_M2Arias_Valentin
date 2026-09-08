-- seed.sql
-- Inserta datos de ejemplo. Ejecutar despues de setup.sql

INSERT INTO authors(name, email, bio) VALUES
  ('Ada Lovelace', 'ada@mail.com', 'Pionera de la programacion'),
  ('Alan Turing', 'alan@mail.com', 'Matematico y criptografo')
ON CONFLICT (email) DO NOTHING;

INSERT INTO posts(author_id, title, content, published)
SELECT a.id, 'Mi primer post', 'Contenido de ejemplo del primer post', true
FROM authors a WHERE a.email = 'ada@mail.com'
ON CONFLICT DO NOTHING;

INSERT INTO posts(author_id, title, content, published)
SELECT a.id, 'Maquinas pensantes', 'Contenido de ejemplo sobre computacion', true
FROM authors a WHERE a.email = 'alan@mail.com'
ON CONFLICT DO NOTHING;

INSERT INTO comments(post_id, author_id, content)
SELECT p.id, a.id, 'Excelente post!'
FROM posts p
JOIN authors a ON a.email = 'alan@mail.com'
WHERE p.title = 'Mi primer post'
ON CONFLICT DO NOTHING;