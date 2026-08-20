-- CreateTable
CREATE TABLE "RegistrationSettings" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "isOpen" BOOLEAN NOT NULL DEFAULT true,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RegistrationSettings_pkey" PRIMARY KEY ("id")
);

-- Insert the default open state for existing installations
INSERT INTO "RegistrationSettings" ("id", "isOpen", "updatedAt")
VALUES (1, true, CURRENT_TIMESTAMP);