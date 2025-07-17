-- CreateTable
CREATE TABLE "User" (
    "User-Id" TEXT NOT NULL,
    "Firstname" TEXT NOT NULL,
    "lastname" TEXT NOT NULL,
    "Username" TEXT NOT NULL,
    "User-email" TEXT NOT NULL,
    "Password" TEXT NOT NULL,
    "Profile-avatar" TEXT,
    "Is-Deleted" BOOLEAN NOT NULL DEFAULT false,
    "Joining-Date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "Latest-Update" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("User-Id")
);

-- CreateTable
CREATE TABLE "Notes" (
    "Notes-ID" TEXT NOT NULL,
    "Title" TEXT NOT NULL,
    "Synopsis" TEXT NOT NULL,
    "Notes" TEXT NOT NULL,
    "Isdeleted" BOOLEAN NOT NULL DEFAULT false,
    "Creation-Date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "Latest-Update" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Notes_pkey" PRIMARY KEY ("Notes-ID")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_Username_key" ON "User"("Username");

-- CreateIndex
CREATE UNIQUE INDEX "User_User-email_key" ON "User"("User-email");

-- AddForeignKey
ALTER TABLE "Notes" ADD CONSTRAINT "Notes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("User-Id") ON DELETE RESTRICT ON UPDATE CASCADE;
