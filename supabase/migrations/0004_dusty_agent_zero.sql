-- 创建新的枚举类型
CREATE TYPE role_enum AS ENUM ('user', 'assistant');

-- 将现有的 role 列重命名为 old_role
ALTER TABLE messages RENAME COLUMN role TO old_role;

-- 添加新的 role 列，允许为空
ALTER TABLE messages ADD COLUMN role role_enum;

-- 更新新的 role 列
UPDATE messages SET role = CASE
    WHEN old_role = 'user' THEN 'user'::role_enum
    WHEN old_role = 'assistant' THEN 'assistant'::role_enum
    ELSE NULL
END;

-- 添加非空约束
ALTER TABLE messages ALTER COLUMN role SET NOT NULL;

-- 删除旧的 role 列
ALTER TABLE messages DROP COLUMN old_role;

-- 如果有任何触发器、索引或约束引用了旧的 role 列，你需要在这里重新创建它们