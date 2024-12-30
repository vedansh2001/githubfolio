/*
  Warnings:

  - You are about to drop the column `status` on the `PullRequest` table. All the data in the column will be lost.
  - Added the required column `full_name` to the `PullRequest` table without a default value. This is not possible if the table is not empty.
  - Added the required column `number` to the `PullRequest` table without a default value. This is not possible if the table is not empty.
  - Added the required column `state` to the `PullRequest` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "PullRequest" DROP COLUMN "status",
ADD COLUMN     "full_name" TEXT NOT NULL,
ADD COLUMN     "number" INTEGER NOT NULL,
ADD COLUMN     "state" TEXT NOT NULL;
