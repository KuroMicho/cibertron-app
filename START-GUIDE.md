## Documentación para desarrolladores

### Pre-requisitos:

Para instalar Angular en la carpeta actual:

-   ng new app --directory=./

-   npm install -g electron

-   Tener instalada la característica OpenSSH, se instala con PowerShell siguiendo este enlace: https://learn.microsoft.com/en-us/windows-server/administration/openssh/openssh_install_firstuse?tabs=powershell

-   Crear una clave SSH en la consola de comandos utilizando el comando `ssh-keygen -t ecdsa-sha2-nistp256`. Si desea cambiar el formato de encriptación de la clave, consulte la documentación de SSH2. En este caso, también se agregó una passphrase; _asegúrese de introducir todos los datos de configuración correctamente_.

-   Asegúrate de que el servicio de Remote Registry esté habilitado en el equipo remoto, de lo contrario, los cambios no se aplicarán. Usa el comando `sc query remoteregistry` en CMD para verificar su estado, si esta desactivado procede a activarlo en _Servicios_.

### User Stories:

https://docs.google.com/document/d/10OrTVuu60Bkl6do6GuGJFodAflCpNuN241mZPEmOGjk/edit#heading=h.z6ne0og04bp5

#### Notes

-   BaseURL en HTML= "./"
-   Algunas etiquetas para la consola de comandos= --flat --skip-tests
