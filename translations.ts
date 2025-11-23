export const translations = {
  es: {
    // General
    language: 'Idioma',
    loading: 'Cargando...',
    saveChanges: 'Guardar Cambios',
    saving: 'Guardando...',
    cancel: 'Cancelar',
    edit: 'Editar',
    delete: 'Eliminar',
    // FIX: Corrected Spanish translation for "close".
    close: 'Cerrar',
    confirm: 'Confirmar',
    notification: 'Notificación',
    page: 'Página',
    of: 'de',
    previous: 'Anterior',
    next: 'Siguiente',
    na: 'N/A',
    yes: 'Sí',
    no: 'No',
    days: 'días',
    
    // Login
    welcomeBack: 'Bienvenido de Vuelta',
    createYourAccountIn: 'Crea tu cuenta en teRecomiendo',
    connectingTalent: 'Conectando talento con oportunidades.',
    selectUserType: '1. Seleccione su tipo de usuario',
    recommenderDescription: 'Recomiende empleos y ayude a conectar talento.',
    seekerDescription: 'Encuentre profesionales y empleos.',
    professionalDescription: 'Muestre su perfil y conecte con clientes.',
    name: 'Nombre',
    email: 'Correo Electrónico',
    password: 'Contraseña',
    showPassword: 'Mostrar contraseña',
    hidePassword: 'Ocultar contraseña',
    createAccount: 'Crear Cuenta',
    login: 'Ingresar',
    alreadyHaveAccount: '¿Ya tienes una cuenta?',
    dontHaveAccount: '¿No tienes una cuenta?',
    signIn: 'Acceder',
    signUp: 'Regístrate',
    forgotPassword: '¿Olvidaste tu contraseña?',
    resetPassword: 'Restablecer Contraseña',
    resetLinkSent: 'Se ha enviado un enlace para restablecer tu contraseña a tu correo electrónico.',
    
    // Errors
    errorAllFields: 'Por favor, complete todos los campos y seleccione un rol.',
    errorEnterEmailPass: 'Por favor, ingrese email y contraseña.',
    errorEmailInUse: 'Este correo electrónico ya está en uso.',
    errorInvalidCredential: 'Correo electrónico o contraseña incorrectos.',
    errorWeakPassword: 'La contraseña debe tener al menos 6 caracteres.',
    errorDefault: 'Ocurrió un error. Por favor, inténtelo de nuevo.',

    // Header
    openUserMenu: 'Abrir menú de usuario',
    logout: 'Salir',
    // FIX: Renamed 'help' to 'help_nav' to avoid duplicate key error with the help section object.
    help_nav: 'Ayuda',

    // Dashboards
    recommenderDashboard: 'Panel de Recomendador',
    seekerDashboard: 'Panel de Buscador',
    professionalDashboard: 'Panel de Profesional',
    adminDashboard: 'Panel de Administrador',
    unrecognizedRole: 'Rol de usuario no reconocido.',
    
    // Settings Dashboard
    settings: {
      title: 'Configuración',
      languageSettings: 'Configuración de Idioma',
      selectLanguage: 'Seleccione su idioma preferido.',
      backToDashboard: 'Volver al Panel',
      english: 'Inglés',
      spanish: 'Español',
      french: 'Français',
      security: 'Seguridad',
      changePassword: 'Cambiar Contraseña',
      changePasswordDescription: 'Actualiza tu contraseña para mantener tu cuenta segura.',
      currentPassword: 'Contraseña Actual',
      newPassword: 'Nueva Contraseña',
      confirmNewPassword: 'Confirmar Nueva Contraseña',
      updatePassword: 'Actualizar Contraseña',
      passwordMismatch: 'Las nuevas contraseñas no coinciden.',
      passwordChangedSuccess: '¡Contraseña cambiada con éxito!',
      reauthenticationNeeded: 'Por favor, introduce tu contraseña actual para confirmar los cambios.',
      changeRoleTitle: 'Cambiar Rol de Usuario',
      changeRoleDescription: 'Si seleccionaste el rol equivocado al registrarte, puedes cambiarlo aquí. Advertencia: esto reiniciará los datos específicos de tu rol actual (perfil, publicaciones, etc.).',
      currentRole: 'Rol Actual',
      newRole: 'Nuevo Rol',
      updateRole: 'Actualizar Rol',
      confirmRoleChangeTitle: 'Confirmar Cambio de Rol',
      confirmRoleChangeMessage: '¿Estás seguro de que quieres cambiar tu rol de "{oldRole}" a "{newRole}"?',
      confirmRoleChangeWarning: 'Todos los datos asociados a tu rol actual (como perfil profesional, empleos publicados, etc.) serán eliminados permanentemente.',
      confirmRoleChangeButton: 'Sí, cambiar rol',
      roleChangedSuccess: '¡Rol actualizado con éxito! Se cerrará tu sesión. Por favor, vuelve a iniciar sesión.',
      roleChangedError: 'Error al cambiar el rol.',
    },

    // Recommender Dashboard
    recommender: {
      dashboardTitle: 'Panel de Recomendador',
      publishNewJob: 'Publicar Nuevo Empleo',
      publishJobDescription: '¿Conoces una oportunidad laboral increíble? Compártela con la comunidad de profesionales.',
      jobTitle: 'Título del Empleo',
      jobTitlePlaceholder: 'Ej: Desarrollador Frontend',
      companyName: 'Nombre de la Empresa',
      companyNamePlaceholder: 'Ej: Tech Solutions Inc.',
      city: 'Ciudad',
      cityPlaceholder: 'Ej: Madrid',
      areaCodeOptional: 'Código de Área (Opcional)',
      areaCodePlaceholder: 'Ej: 28001',
      jobDescription: 'Descripción del Empleo',
      jobDescriptionPlaceholder: 'Describe las responsabilidades, requisitos, etc.',
      jobType: 'Tipo de Empleo',
      fullTime: 'Tiempo Completo',
      partTime: 'Medio Tiempo',
      remote: 'Remoto',
      salaryOptional: 'Salario (Opcional)',
      amount: 'Monto',
      amountPlaceholder: 'Ej: 50000',
      paymentType: 'Tipo de Pago',
      perYear: 'Por Año',
      perHour: 'Por Hora',
      contactInfoOptional: 'Información de Contacto (Opcional)',
      contactPerson: 'Persona de Contacto',
      contactPersonPlaceholder: 'Ej: Juan Pérez',
      contactPhone: 'Teléfono de Contacto',
      contactPhonePlaceholder: 'Ej: +1 234 567 890',
      contactEmail: 'Correo de Contacto',
      contactEmailPlaceholder: 'Ej: contacto@empresa.com',
      functionsToPerform: 'Funciones a Realizar',
      addNewFunctionPlaceholder: 'Añadir nueva función',
      add: 'Añadir',
      publishJob: 'Publicar Empleo',
      publishing: 'Publicando...',
      myPublishedJobs: 'Mis Empleos Publicados',
      searchByTitle: 'Buscar por título...',
      searchByCompany: 'Buscar por empresa...',
      applicant: 'postulante',
      applicants: 'postulantes',
      jobPublishedSuccessfully: '¡Empleo publicado con éxito!',
      errorPublishingJob: 'Ocurrió un error al publicar el empleo.',
      profileUpdatedSuccessfully: 'Perfil actualizado con éxito.',
      errorUpdatingProfile: 'Error al actualizar el perfil.',
      photoCaptured: 'Foto capturada. No olvide guardar los cambios.',
      jobUpdatedSuccessfully: 'Empleo actualizado con éxito.',
      couldNotUpdateJob: 'No se pudo actualizar el empleo.',
      deletionRequestSent: 'Solicitud de eliminación enviada al administrador.',
      recommenderProfile: 'Perfil de Recomendador',
      noPhone: 'Sin teléfono',
      opinion: 'opinión',
      opinions: 'opiniones',
      publishedJobs: 'Empleos publicados',
      editProfile: 'Editar Perfil',
      officialRecommendersProgram: 'Programa Oficial de Recomendadores',
      recommenderProgramDescription: 'Participe como Recomendador Certificado y contribuya a que más personas accedan a oportunidades laborales reales, mientras obtiene beneficios por su aporte.',
      programBenefits: 'Beneficios del programa:',
      benefitPerJob: 'por cada empleo verificado y real.',
      benefitPerApplication: 'por cada candidato que se postule mediante su enlace.',
      benefitPerHire: 'por cada contratación confirmada gracias a su recomendación.',
      ourCommitment: 'Nuestro Compromiso:',
      commitment1: 'Verificamos la reputación del empleador.',
      commitment2: 'Evaluamos que el empleo sea real.',
      commitment3: 'Confirmamos que el candidato realmente inició el trabajo.',
      importantNotice: 'Importante: Todos los pagos aplican condiciones y están sujetos a verificaciones previas, como la veracidad del empleo y la confirmación de la contratación efectiva de la persona recomendada.',
      communityStrength: 'Tu participación fortalece nuestra comunidad y ayuda a construir un entorno laboral más eficaz, transparente y real.',
      recommendWithConfidence: '¡Recomiende con confianza!',
      editMyProfile: 'Editar mi Perfil',
      emailCannotBeChanged: 'El correo electrónico no se puede modificar.',
      phone: 'Teléfono',
      profilePhoto: 'Foto de Perfil',
      photoUrlPlaceholder: 'https://ejemplo.com/foto.jpg',
      capturePhoto: 'Capturar Foto',
      editJob: 'Editar Empleo',
      applicantsFor: 'Postulantes para',
      loadingApplicants: 'Cargando postulantes...',
      noApplicantsYet: 'Aún no hay postulantes para este empleo.',
      requestJobDeletion: 'Solicitar Eliminación de Empleo',
      confirmJobDeletion: '¿Está seguro de que desea solicitar la eliminación del empleo',
      jobDeletionNotice: 'Un administrador deberá aprobar esta solicitud. El empleo no será visible para los buscadores mientras la solicitud esté pendiente.',
      yesRequestDeletion: 'Sí, solicitar eliminación',
      sending: 'Enviando...',
      noJobsFoundWithFilters: 'No se encontraron empleos con los filtros actuales.',
      applicantsModalTitle: 'Postulantes para',
      coverLetterNone: 'Sin carta de presentación.',
      cv: 'CV',
      viewCV: 'Ver CV',
      hired: 'CONTRATADO',
      approveAndForward: 'Aprobar y Enviar',
      rejectApplication: 'Rechazar',
      updateStatus: 'Actualizar Estado',
      selectStatus: 'Seleccionar estado',
      shareJob: {
        title: "Compartir Oferta de Empleo",
        description: "Comparte esta oportunidad en tus redes sociales o copia el enlace.",
        text: "¡Mira esta oportunidad de empleo para {jobTitle} en {companyName} que encontré en teRecomiendo!"
      },
      earnings: {
        title: 'Mis Ganancias',
        pending: 'Pendiente',
        received: 'Recibido',
        totalGenerated: 'Total Generado',
        paymentHistory: 'Historial de Pagos',
        noPaymentsYet: 'Aún no has recibido ningún pago.',
        date: 'Fecha',
        amount: 'Monto',
        proof: 'Comprobante',
        viewProof: 'Ver Comprobante',
        notes: 'Notas',
        noNotes: 'Sin notas.',
      },
      forwarding: 'Enviando...',
      applicationForwarded: 'Postulación enviada a la empresa.',
      applicationRejected: 'Postulación rechazada.',
      statusUpdated: 'Estado actualizado.',
      errorUpdatingStatus: 'Error al actualizar el estado.',
      errorForwarding: 'Error al enviar la postulación.',
      errorRejecting: 'Error al rechazar la postulación.',
      companyResponse: 'Respuesta de la empresa',
    },

    // Seeker Dashboard
    seeker: {
      dashboardTitle: 'Panel de Buscador',
      advancedSearch: 'Búsqueda Avanzada',
      professionals: 'Profesionales',
      jobs: 'Empleos',
      searchByName: 'Buscar por nombre...',
      searchBySpecialty: 'Buscar por especialidad...',
      searchByKeyword: 'Buscar por palabra clave (ej: rol, habilidad)',
      searchByCity: 'Buscar por ciudad...',
      search: 'Buscar',
      searching: 'Buscando...',
      professionalsFound: 'profesional(es) encontrado(s)',
      jobsFound: 'empleo(s) encontrado(s)',
      noProfessionalsFound: 'No se encontraron profesionales.',
      noJobsFound: 'No se encontraron empleos.',
      viewProfile: 'Ver Perfil',
      viewAndContact: 'Ver y Contacter',
      viewDetails: 'Ver Detalles',
      recommendedBy: 'Recomendado por:',
      applicationsOf: 'de',
      applications: 'postulaciones',
      jobFull: 'Postulaciones cerradas',
      myProfile: 'Mi Perfil',
      notSpecified: 'No especificado',
      editProfile: 'Editar Perfil',
      myJobApplications: 'Mis Postulaciones de Empleo',
      myServiceRequests: 'Mis Solicitudes de Servicio',
      searchInMyApps: 'Buscar en mis postulaciones...',
      searchInMyRequests: 'Buscar en mis solicitudes...',
      appliedOn: 'Postulado el:',
      sentOn: 'Enviada el:',
      rate: 'Calificar',
      withdraw: 'Retirar',
      pending: 'Pendiente',
      cancelRequest: 'Cancelar',
      noApplicationsYet: 'Aún no te has postulado a ningún empleo.',
      noRequestsYet: 'Aún no has enviado ninguna solicitud de servicio.',
      professionalProfile: 'Perfil del Profesional',
      successfulServices: 'servicios exitosos',
      bio: 'Biografía',
      noBio: 'Sin biografía.',
      services: 'Servicios',
      noServicesListed: 'No hay servicios listados.',
      contact: 'Contactar',
      contactProfessional: 'Contactar a',
      contactAndProfileTitle: 'Perfil y Contacto de {name}',
      requestSubject: 'Asunto de la solicitud',
      describeNeed: 'Describa su necesidad',
      attachPhotoOptional: 'Adjuntar una foto (opcional)',
      serviceDay: 'Día del servicio',
      serviceTime: 'Hora del servicio',
      locationOptional: 'Ubicación (Opcional)',
      locationPlaceholder: 'Escriba una dirección o comparta su ubicación',
      share: 'Compartir',
      shareCurrentLocation: 'Compartir Ubicación Actual',
      confirmRequest: 'Confirmar Solicitud',
      jobDetails: 'Detalles del Empleo',
      unlockAndApply: 'Desbloquear y Postularse',
      premiumAccess: 'Acceso Premium',
      premiumAccessDescription: 'Para ver los detalles completos de la empresa y postularte, elige una opción:',
      recommendedOption: 'Opción Recomendada',
      buyMembership: 'Comprar Membresía',
      membershipBenefit: 'Accede a todas las postulaciones de forma ilimitada.',
      buyFor: 'Comprar por',
      singlePayment: 'Pago Único por Postulación',
      singlePaymentDescription: 'Desbloquea esta oferta de empleo por un pago único de',
      pay: 'Pagar',
      applyTo: 'Postularse a',
      contactInfo: 'Información de Contacto de la Empresa',
      person: 'Persona',
      email: 'Email',
      phone: 'Teléfono',
      coverLetterOptional: 'Carta de Presentación (Opcional)',
      attachResume: 'Adjuntar Hoja de Vida (CV)',
      confirmApplication: 'Confirmar Postulación',
      rateRecommender: 'Calificar a',
      rateProfessional: 'Calificar a',
      opinionHelps: 'Su opinión ayuda a otros a tomar mejores decisiones.',
      opinionCommunity: 'Su opinión es importante para construir una comunidad de confianza.',
      sendRating: 'Enviar Calificación',
      editMyProfile: 'Editar mi Perfil',
      phoneNumber: 'Número de Teléfono',
      address: 'Dirección',
      areaCode: 'Código Postal',
      documentType: 'Tipo de Documento',
      documentNumber: 'Número de Documento',
      city: 'Ciudad',
      profilePhoto: 'Foto de Perfil',
      selectIdType: 'Seleccione un tipo',
      cc: 'Cédula de Ciudadanía',
      ce: 'Cédula de Extranjería',
      passport: 'Pasaporte',
      uploadPhoto: 'Subir Foto',
      changePhoto: 'Cambiar Foto',
      photoPreview: 'Vista Previa de la Foto',
      editApplication: 'Editar Postulación para',
      updateResume: 'Actualizar Hoja de Vida (CV)',
      updateResumeDescription: 'Adjunte un nuevo archivo solo si desea reemplazar el anterior',
      withdrawApplication: 'Retirar Postulación',
      confirmWithdraw: '¿Está seguro de que desea retirar su postulación para el empleo',
      actionCannotBeUndone: 'Esta acción no se puede deshacer.',
      yesWithdraw: 'Sí, retirar postulación',
      withdrawing: 'Retirando...',
      editRequest: 'Editar Solicitud para {name}',
      requestDetails: 'Detalles de la necesidad',
      cancelServiceRequest: 'Cancelar Solicitud de Servicio',
      confirmCancelRequest: '¿Está seguro que desea cancelar su solicitud?',
      noKeep: 'No, mantener',
      yesCancel: 'Sí, cancelar',
      cancelling: 'Cancelando...',
      locationObtained: 'Ubicación obtenida con éxito.',
      couldNotGetLocation: 'No se pudo obtener la ubicación.',
      geolocationNotSupported: 'La geolocalización no es compatible con este navegador.',
      requestSentSuccessfully: '¡Solicitud enviada con éxito!',
      profileUpdatedSuccessfully: 'Perfil actualizado con éxito.',
      paymentCompleted: '¡Pago completado! Ahora puede postularse.',
      errorConfirmingPurchase: 'Error al confirmar la compra.',
      applicationSentSuccessfully: '¡Postulación enviada con éxito!',
      ratingSavedSuccessfully: '¡Calificación guardada con éxito!',
      couldNotSaveRating: 'No se pudo guardar la calificación.',
      applicationUpdated: 'Postulación actualizada.',
      applicationWithdrawnSuccessfully: 'Postulación retirada con éxito.',
      requestUpdated: 'Solicitud actualizada.',
      requestCancelledSuccessfully: 'Solicitud cancelada con éxito.',
      paymentError: 'Error de pago:',
      loadingPaymentGateway: 'Cargando pasarela de pago...',
      errorSearchingProfessionals: 'Error al buscar profesionales.',
      errorSearchingJobs: 'Error al buscar empleos.',
      shareRecommendation: 'Compartir Recomendación',
      shareProfessionalMsg: '¡Hola! Te recomiendo a este excelente profesional que encontré en teRecomiendo:',
      shareRecommenderMsg: '¡Hola! Gracias a este recomendador encontré una gran oportunidad en teRecomiendo:',
      copyToClipboard: 'Copiar enlace',
      copied: '¡Enlace copiado!',
      alreadyApplied: 'Ya has postulado',
      previewCV: 'Previsualizar CV',
      sendToCompany: 'Enviar postulación directamente a la empresa',
      sendCopyToRecommender: 'Enviar copia al recomendador',
      atLeastOneOption: 'Debes seleccionar al menos una opción de envío.',
      applicationConfirmation: 'Confirmación de Postulación',
      confirmationNumber: 'Tu número de confirmación es:',
      applicationEmailSubject: 'Nueva Postulación para: {jobTitle}',
      applicationEmailBody: '<h1>Nueva Postulación Recibida</h1><p>Has recibido una nueva postulación para el empleo <strong>{jobTitle}</strong> de parte de <strong>{seekerName}</strong>.</p><p><strong>Carta de Presentación:</strong></p><p>{coverLetter}</p><p>Puedes ver el CV del candidato en el siguiente enlace: <a href="{cvUrl}">Ver CV</a></p><p>Gracias,<br>El equipo de teRecomiendo</p>',
      seekerApplicationEmailBody: '<h1>Confirmación de tu Postulación</h1><p>Hola {seekerName},</p><p>Hemos recibido correctamente tu postulación para el puesto de <strong>{jobTitle}</strong> en <strong>{companyName}</strong>.</p><p>Tu número de confirmación es: <strong>{confirmationNumber}</strong>.</p><p>¡Te deseamos mucha suerte!</p><p>Gracias,<br>El equipo de teRecomiendo</p>',
      jobFullEmailSubject: '¡Tu oferta de empleo "{jobTitle}" ha alcanzado el límite de postulantes!',
      jobFullEmailBody: '<h1>¡Felicitaciones!</h1><p>Tu oferta de empleo <strong>{jobTitle}</strong> ha alcanzado el número máximo de postulantes y ahora está cerrada a nuevas postulaciones.</p><p>Puedes revisar los candidatos desde tu panel de recomendador.</p><p>Gracias,<br>El equipo de teRecomiendo</p>',
      applyNow: 'Postularse Ahora',
      errorSubmittingApplication: 'Error al enviar la postulación. Inténtelo de nuevo.',
      errorNetwork: 'Error de red al subir el archivo. Por favor, verifique su conexión e intente de nuevo.',
      errorUnauthorizedUpload: 'Error de permisos. No se pudo subir el archivo.',
      uploadProgress: 'Progreso de Carga',
      uploading: 'Subiendo...',
      processing: 'Procesando...',
      companyContactInfo: 'Información de Contacto de la Empresa',
      proceedToApplication: 'Proceder a la Postulación',
      jobUnlockedSuccess: '¡Oferta desbloqueada! Ahora puedes ver los detalles de contacto.',
      applicationStatusTracker: 'Seguimiento de la Postulación',
      viewJobOffer: 'Ver oferta de empleo',
      tracker: {
        step1: 'Postulación Enviada',
        step2: 'Revisión del Recomendador',
        step3: 'Enviado a la Empresa',
        step4: 'Respuesta de la Empresa',
      },
      applicationStatus: {
        submitted: 'Postulación recibida por el recomendador.',
        recommender_rejected: 'El recomendador ha descartado tu perfil.',
        forwarded_to_company: '¡Tu perfil fue enviado a la empresa!',
        under_review: 'La empresa está revisando tu perfil.',
        interviewing: '¡Has sido seleccionado para una entrevista!',
        company_rejected: 'La empresa ha decidido no continuar con tu postulación.',
        hired: '¡Felicidades! Has sido contratado.',
      },
      addToFavorites: 'Añadir a favoritos',
      removeFromFavorites: 'Quitar de favoritos',
      applicantsProgress: '{count} de {max} postulantes',
      requestStatus: {
        in_process: 'En Proceso',
        accepted: 'Aceptada',
        completed: 'Completado',
        cancelled: 'Cancelada',
      },
      deleteRequest: {
        title: 'Eliminar Solicitud Completada',
        message: '¿Está seguro de que desea eliminar esta solicitud completada y calificada de su historial?',
        confirm: 'Sí, eliminar',
        success: 'Solicitud eliminada con éxito.',
        error: 'Error al eliminar la solicitud.'
      },
    },
    
    // Professional Dashboard
    professional: {
      dashboardTitle: 'Panel de Profesional',
      profilePending: 'Su perfil está pendiente de revisión por un administrador.',
      profileApproved: '¡Felicidades! Su perfil ha sido aprobado y ahora es visible para los buscadores.',
      profileRejected: 'Su perfil ha sido rechazado. Por favor, revise su contenido y vuelva a enviarlo.',
      myPublicProfile: 'Mi Perfil Público',
      addYourSpecialty: 'Añada su especialidad',
      addYourBio: 'Añada una biografía para atraer clientes.',
      contactInfo: 'Información de Contacto',
      email: 'Email',
      phone: 'Teléfono',
      notSpecified: 'No especificado',
      services: 'Servicios',
      addServicesYouOffer: 'Añada los servicios que ofrece.',
      myAvailability: 'Mi Disponibilidad',
      noAvailability: "No has especificado tu disponibilidad.",
      schedule: 'Horario',
      serviceRequests: 'Solicitudes de Servicio',
      received: 'Recibido',
      need: 'Necesidad',
      clientData: 'Datos del Cliente',
      name: 'Nombre',
      requestedDate: 'Fecha Solicitada',
      requestedTime: 'Hora Solicitada',
      location: 'Ubicación',
      viewOnMap: 'Ver en mapa',
      searchOnMap: 'Buscar en mapa',
      openChat: 'Abrir Chat',
      finishService: 'Finalizar Servicio',
      clientDataLocked: 'Datos del Cliente Bloqueados',
      unlockToView: 'Desbloquee para ver los detalles de contacto y la ubicación.',
      viewClientData: 'Ver Datos del Cliente',
      noActiveRequests: 'Aún no has recibido ninguna solicitud de servicio activa.',
      attendedServicesHistory: 'Historial de Servicios Atendidos',
      finished: 'Finalizado',
      ratingGiven: 'Calificación Otorgada',
      noFinishedServices: 'Aún no has finalizado ningún servicio.',
      statistics: 'Estadísticas',
      requestsReceived: 'Solicitudes Recibidas',
      membership: 'Membresía',
      active: 'Activa',
      inactive: 'Inactiva',
      improveVisibility: 'Mejorar Visibilidad',
      editProfessionalProfile: 'Editar Perfil Profesional',
      specialty: 'Especialidad',
      specialtyPlaceholder: 'Ej: Desarrollador Full-Stack',
      shortBio: 'Biografía Corta',
      bioPlaceholder: 'Una breve descripción sobre usted y su trabajo.',
      phonePlaceholder: 'Ej: +1 234 567 890',
      manageServices: 'Gestionar Servicios',
      noServicesAdded: 'No hay servicios añadidos.',
      addNewServicePlaceholder: 'Añadir nuevo servicio',
      idForVerification: 'Documento de Identidad (para verificación)',
      idUploadNotice: 'Subir un nuevo documento lo enviará a revisión.',
      unlockContact: 'Desbloquear Contacto',
      unlockContactDescription: 'Para ver los detalles completos del cliente y contactarlo, elija una opción:',
      recommendedOption: 'Opción Recomendada',
      acquireMembership: 'Adquirir Membresía',
      membershipBenefit: 'Acceda a todas las solicitudes de forma ilimitada y mejore su visibilidad.',
      viewMembershipPlans: 'Ver Planes de Membresía',
      singleUnlockPayment: 'Pago Único por Desbloqueo',
      singleUnlockDescription: 'Desbloquea esta solicitud específica por un pago único de',
      pay: 'Pagar',
      acquireMembershipTitle: 'Adquirir Membresía',
      acquireMembershipDescription: 'Elija un plan para desbloquear todas las solicitudes y mejorar su visibilidad.',
      daysOfAccess: 'días de acceso ilimitado',
      buyFor: 'Comprar por',
      finishServiceTitle: 'Finalizar Servicio',
      completionDate: 'Fecha de Finalización',
      rateClient: 'Calificar al Cliente',
      confirm: 'Confirmar',
      confirmDeletion: 'Confirmar Eliminación',
      confirmDeleteHistory: '¿Está seguro de que desea eliminar este registro del historial? Esta acción no se puede deshacer.',
      yesDelete: 'Sí, eliminar',
      editAvailability: 'Editar Disponibilidad',
      describeYourSchedule: 'Describa su horario',
      schedulePlaceholder: 'Ej: Lunes a Viernes, 9am - 5pm',
      newServiceRequest: '¡Has recibido una nueva solicitud de servicio!',
      loadingProfile: 'Cargando perfil...',
      profileSavedForReview: 'Perfil guardado y enviado a revisión.',
      couldNotSaveProfile: 'No se pudo guardar el perfil.',
      attendanceSaved: 'Servicio finalizado y calificado con éxito.',
      couldNotSaveAttendance: 'No se pudo guardar la información.',
      completeDateAndRatingError: 'Por favor, complete la fecha y la calificación.',
      availabilitySaved: 'Disponibilidad guardada con éxito.',
      couldNotSaveAvailability: 'No se pudo guardar la disponibilidad.',
      recordDeleted: 'Registro eliminado del historial.',
      couldNotDeleteRecord: 'No se pudo eliminar el registro.',
      invalidPhoneNumber: 'El número de teléfono proporcionado no es válido.',
      completedServices: 'Servicios Completados',
      averageRating: 'Calificación Promedio',
      notYetRated: "Aún no calificado",
      remindToRate: "Recordar Calificar",
      reminderSent: "Recordatorio enviado con éxito.",
      errorSendingReminder: "Error al enviar el recordatorio.",
    },
    
    // Admin Dashboard
    admin: {
      dashboardTitle: 'Panel de Administrador',
      pendingProfiles: 'Perfiles Pendientes de Revisión',
      manageMemberships: 'Gestionar Membresías',
      requestsMonitor: 'Monitor de Solicitudes',
      globalJobSettings: 'Configuración Global de Empleos',
      jobDeletionRequests: 'Solicitudes de Eliminación de Empleos',
      configureRecommenderPayouts: 'Configurar Pagos a Recomendadores',
      userManagement: 'Gestión de Usuarios',
      loading: 'Cargando...',
      noPendingProfiles: 'No hay perfiles pendientes.',
      approve: 'Aprobar',
      reject: 'Rechazar',
      noMembershipPlans: 'No hay planes de membresía.',
      addMembership: 'Añadir Membresía',
      noServiceRequests: 'No hay solicitudes de servicio.',
      from: 'De',
      to: 'Para',
      status: 'Estado',
      maxApplicantsLimit: 'Límite Máximo de Postulantes',
      maxApplicantsDescription: 'Este número se aplicará a todas las ofertas de empleo. Deje en blanco para no tener límite.',
      noLimit: 'Sin límite',
      save: 'Guardar',
      noPendingDeletions: 'No hay solicitudes de eliminación pendientes.',
      recommender: 'Recomendador',
      approveDeletion: 'Aprobar Eliminación',
      rejectDeletion: 'Rechazar',
      payoutPerVerifiedJob: 'Pago por empleo verificado ($)',
      payoutPerApplication: 'Pago por postulación ($)',
      payoutPerConfirmedHire: 'Pago por contratación confirmada ($)',
      saveConfiguration: 'Guardar Configuración',
      advancedSearch: 'Búsqueda Avanzada',
      searchByName: 'Buscar por nombre...',
      searchByEmail: 'Buscar por email...',
      allRoles: 'Todos los Roles',
      tableHeaderName: 'Nombre',
      tableHeaderEmail: 'Email',
      tableHeaderRole: 'Rol',
      tableHeaderVerification: 'Verificación',
      tableHeaderActions: 'Acciones',
      verificationSent: 'Enviado',
      verificationNotSent: 'No enviado',
      removeVerification: 'Quitar Verificación',
      verify: 'Verificar',
      showing: 'Mostrando',
      of: 'de',
      editUser: 'Editar Usuario',
      role: 'Rol',
      editMembership: 'Editar Membresía',
      addMembershipTitle: 'Añadir Membresía',
      planName: 'Nombre del Plan',
      price: 'Precio ($)',
      durationDays: 'Duración (días)',
      durationDaysHelpText: 'Define por cuántos días será válida la membresía después de la compra.',
      createPlan: 'Crear Plan',
      confirmDeletion: 'Confirmar Eliminación',
      confirmDeleteUser: '¿Está seguro de que desea eliminar a',
      deleteUserWarning: 'Esta acción es irreversible y eliminará todos los datos asociados (perfiles, solicitudes, publicaciones, etc.).',
      yesDeleteUser: 'Sí, eliminar usuario',
      deleting: 'Eliminando...',
      confirmVerificationToggle: '¿Está seguro de que desea',
      verifying: 'verificar a',
      unverifying: 'quitar la verificación de',
      professionalVerified: 'Profesional verificado con éxito.',
      professionalUnverified: 'Profesional desverificado con éxito.',
      couldNotUpdateVerification: 'No se pudo actualizar el estado de verificación.',
      userDeleted: 'Usuario y todos sus datos asociados han sido eliminados.',
      errorDeletingUser: 'Ocurrió un error al eliminar el usuario.',
      confirmDeleteMembership: '¿Está seguro de que desea eliminar este plan de membresía?',
      globalSettingsSaved: 'Configuración global guardada con éxito.',
      couldNotSaveGlobalSettings: 'No se pudo guardar la configuración.',
      payoutSettingsSaved: 'Configuración de pagos guardada.',
      errorSavingPayoutSettings: 'Error al guardar la configuración.',
      jobDeleted: 'Empleo y postulaciones asociadas eliminados.',
      errorDeletingJob: 'Error al eliminar el empleo.',
      deletionRejected: 'Solicitud de eliminación rechazada. El empleo ha sido reactivado.',
      errorRejectingDeletion: 'Error al rechazar la solicitud.',
      systemTools: 'Herramientas del Sistema',
      sendTestEmail: 'Enviar Email de Prueba',
      testEmailDescription: 'Verifica la configuración del servidor de correo enviando un mensaje de prueba.',
      recipientEmail: 'Email del Destinatario',
      sendTest: 'Enviar Prueba',
      sendingTest: 'Enviando...',
      testEmailSent: 'Email de prueba enviado a la cola. Revisa la bandeja de entrada de {email}.',
      testEmailError: 'Error al enviar el email de prueba.',
      invalidEmail: 'Por favor, introduce un correo electrónico válido.',
      subject: 'Asunto',
      messageBody: 'Cuerpo del Mensaje',
      emailDeliveryStatus: 'Estado del Envío de Correo',
      statusPending: 'Pendiente... Esperando respuesta del servidor.',
      statusSuccess: '¡Éxito! Correo entregado correctamente.',
      statusError: 'Error al entregar el correo: {error}',
      editUserTitle: 'Editar Usuario',
      userVerification: 'Verificación de Usuario',
      verified: 'Verificado',
      notVerified: 'No Verificado',
      toggleVerification: 'Cambiar Verificación',
      userUpdatedSuccess: 'Usuario actualizado correctamente.',
      errorUpdatingUser: 'Error al actualizar el usuario.',
      userVerifiedSuccess: 'Usuario verificado.',
      userUnverifiedSuccess: 'Verificación de usuario eliminada.',
      errorTogglingVerification: 'Error al cambiar el estado de verificación.',
      viewDetails: "Ver Detalles",
      approveProfileTooltip: "Aprobar perfil",
      rejectProfileTooltip: "Rechazar perfil",
      profileDetailsTitle: "Detalles del Perfil Profesional",
      jobDetailsTitle: "Detalles del Empleo",
      idDocument: "Documento de Identidad",
      viewIdDocument: "Ver Documento",
      noDocumentUploaded: "No se ha subido ningún documento.",
      actions: {
        deactivate: 'Desactivar',
        activate: 'Activar',
        confirmDeactivate: 'Confirmar Desactivación',
        confirmActivate: 'Confirmar Activación',
        deactivateMessage: '¿Está seguro de que desea desactivar a {name}? El usuario no podrá iniciar sesión.',
        activateMessage: '¿Está seguro de que desea activar a {name}? El usuario podrá volver a iniciar sesión.',
      },
      userStatuses: {
        active: 'Activo',
        disabled: 'Desactivado'
      },
      nav: {
        verifications: 'Verificaciones',
        hiring: 'Contrataciones y Pagos',
        users: 'Gestión de Usuarios',
        config: 'Ajustes y Tarifas',
      },
      management: {
        manageJobs: 'Gestionar Empleos',
        noUnverifiedJobs: 'No hay empleos por verificar.',
        verifyJob: 'Verificar Empleo',
        manageApplications: 'Gestionar Postulaciones',
        noPendingHires: 'No hay postulaciones pendientes de contratación.',
        markAsHired: 'Marcar como Contratado',
        recommenderPayouts: 'Pagos a Recomendadores',
        noPendingPayouts: 'No hay ganancias pendientes de pago.',
        pendingAmount: 'Monto Pendiente',
        registerPayment: 'Registrar Pago',
        paymentTo: 'Registrar Pago para',
        amountToPay: 'Monto a Pagar',
        paymentNotesOptional: 'Notas (Opcional)',
        paymentProofOptional: 'Comprobante de Pago (Opcional)',
        paymentProcessing: 'Procesando pago...',
        paymentSuccess: '¡Pago registrado con éxito!',
        paymentError: 'Error al registrar el pago.',
        jobVerifiedSuccess: '¡Empleo verificado! Se ha generado una ganancia.',
        hireConfirmedSuccess: '¡Contratación confirmada! Se ha generado una ganancia.',
        searchPlaceholder: 'Buscar por candidato, empleo o empresa...',
        tableHeaderCandidate: 'Candidato',
        tableHeaderJob: 'Empleo',
        tableHeaderRecommender: 'Recomendador',
        tableHeaderStatus: 'Estado',
        tableHeaderActions: 'Acciones',
        updateStatusTitle: 'Actualizar Estado de Postulación',
        candidateInfo: 'Información del Candidato',
        recommenderInfo: 'Información del Recomendador',
        viewCV: 'Ver Hoja de Vida',
      },
    },
    
    // Shared components
    payment: {
      cardNumber: 'Número de Tarjeta',
      expiry: 'Vencimiento (MM/AA)',
      payNow: 'Pagar ahora',
      processing: 'Procesando...',
      error: {
        fillAllFields: 'Por favor, complete todos los campos de la tarjeta.'
      }
    },
    publicJobView: {
      jobNotFound: "Oferta de empleo no encontrada.",
      errorLoadingJob: "Error al cargar la oferta de empleo.",
      applyNowLogin: "Inicia Sesión para Postularte"
    },

    // Email Templates
    emails: {
        welcomeSubject: '¡Bienvenido a teRecomiendo!',
        welcomeBodySeeker: `
          <h1>¡Bienvenido a Te Recomiendo! 👋</h1>
          <p>Gracias por unirte a la plataforma donde tu búsqueda de empleo se vuelve más clara, más directa y más efectiva.</p>
          <p>Aquí podrás:</p>
          <ul>
            <li>✅ Acceder a oportunidades reales</li>
            <li>✅ Postularte con apoyo de un recomendador</li>
            <li>✅ Recibir notificaciones del estado de tus aplicaciones</li>
            <li>✅ Conectar con empresas que están buscando talento como tú</li>
            <li>✅ Conectar con profesionales que ofrecen servicios</li>
          </ul>
          <p>Este es el primer paso hacia una nueva oportunidad profesional.<br>¡Estamos felices de tenerte aquí!</p>
          <p>👉 Ingresa a tu panel: <a href="https://terecomiendo.ca">https://terecomiendo.ca</a></p>
        `,
        welcomeBodyRecommender: `
          <h1>¡Bienvenido a Te Recomiendo! 🙌</h1>
          <p>Gracias por unirte como recomendador y formar parte de una red que ayuda a otros a encontrar trabajo. y gana comisiones</p>
          <p>En nuestra plataforma podrás:</p>
          <ul>
            <li>✅ Publicar oportunidades laborales</li>
            <li>✅ Recomendar candidatos y ayudarlos a postularse</li>
            <li>✅ Recibir notificaciones cuando tus recomendados aplican</li>
            <li>✅ Generar ingresos a través de tus publicaciones</li>
          </ul>
          <p>Tu rol es clave para crear conexiones que generan oportunidades reales.<br>¡Gracias por aportar a esta comunidad!</p>
          <p>👉 Accede a tu cuenta: <a href="https://terecomiendo.ca">https://terecomiendo.ca</a></p>
        `,
        welcomeBodyProfessional: `
          <h1>¡Bienvenido a Te Recomiendo! 🏢✨</h1>
          <p>Gracias por unirte como profesional y formar parte de una red que ayuda a otros a resolver problemas y necesidades de un profesional</p>
          <p>En nuestra plataforma podrás:</p>
          <ul>
            <li>✅ Crear y ofrecer servicios verificadas</li>
            <li>✅ Conectar con personas que necesitan servicios reales</li>
            <li>✅ Gestionar aplicaciones fácilmente desde tu correo</li>
            <li>✅ Encontrar oportunidades ne negocio</li>
          </ul>
          <p>Tu ahora formas parte de una comunidad que une el talento de las personas con las oportunidades</p>
          <p>👉 Entra al portal empresarial: <a href="https://terecomiendo.ca">https://terecomiendo.ca</a></p>
        `,
        seekerToCompany: {
            subject: 'Nuevo candidato numero({applicationId}) para su oferta publicada por un recomendador en nuestra plataforma',
            body: `
                <h1>Mensaje automatico de Te recomiendo.</h1>
                <p>Hola {companyName},</p>
                <p>El usuario <strong>{seekerName}</strong> se ha postulado a su vacante: <strong>{jobTitle}</strong>.</p>
                <hr>
                <h3>Datos del candidato:</h3>
                <ul>
                    <li><strong>Nombre:</strong> {seekerName}</li>
                    <li><strong>Email:</strong> {seekerEmail}</li>
                    <li><strong>Teléfono:</strong> {seekerPhone}</li>
                    <li><strong>Documento adjunto:</strong> <a href="{cvUrl}">Ver Hoja de Vida</a></li>
                </ul>
                <hr>
                <h3>Recomendador:</h3>
                <ul>
                    <li><strong>Nombre:</strong> {recommenderName}</li>
                    <li><strong>Email:</strong> {recommenderEmail}</li>
                    <li><strong>Teléfono:</strong> {recommenderPhone}</li>
                </ul>
                <hr>
                <p>Para facilitar el proceso, puede responder directamente a este correo indicando alguna de las siguientes opciones:</p>
                <ol>
                    <li><strong>INTERESADO</strong> — Deseo contactar al candidato</li>
                    <li><strong>PARA ENTREVISTA</strong> — Enviar fecha y hora sugerida</li>
                    <li><strong>NO SELECCIONADO</strong> — No cumple el perfil</li>
                    <li><strong>PUESTO YA CONTRATADO</strong> — Hemos contratado al candidato</li>
                </ol>
                <p>Su respuesta será registrada automáticamente en la plataforma para mantener trazabilidad.</p>
                <br>
                <p>Muchas gracias,<br><strong>Te Recomiendo</strong><br><em>Tu plataforma que une talentos con oportunidades laborales.</em></p>
                <p><a href="https://terecomiendo.ca">https://terecomiendo.ca</a></p>
            `
        },
        seekerToRecommender: {
            subject: 'Un candidato se ha postulado a tu oferta: {jobTitle}',
            body: `
                <h1>Notificación de Postulación</h1>
                <p>Hola {recommenderName},</p>
                <p>El candidato <strong>{seekerName}</strong> se ha postulado a la oferta de empleo "<strong>{jobTitle}</strong>" que publicaste.</p>
                <p><strong>Carta de presentación:</strong></p>
                <p><em>{coverLetter}</em></p>
                <p><strong>Documento adjunto:</strong> <a href="{cvUrl}">Ver Hoja de Vida</a></p>
                <p>Gracias por tu contribución a la comunidad.</p>
            `
        },
        failedLoginsWarningSubject: 'Alerta de Seguridad: Intentos de inicio de sesión en tu cuenta',
        failedLoginsWarningBody: '<h1>Alerta de Seguridad</h1><p>Hola,</p><p>Hemos detectado múltiples intentos fallidos de inicio de sesión para tu cuenta. Si no has sido tú, te recomendamos que restablezcas tu contraseña inmediatamente.</p>',
        passwordChangedSubject: 'Confirmación de Cambio de Contraseña',
        passwordChangedBody: '<h1>Tu contraseña ha sido cambiada</h1><p>Hola {name},</p><p>Este correo confirma que la contraseña de tu cuenta ha sido cambiada exitosamente. Si no has realizado este cambio, por favor contacta a nuestro soporte de inmediato.</p>',
        professional: {
            profileSubmittedSubject: 'Tu perfil de profesional está en revisión',
            profileSubmittedBody: '<h1>Hemos recibido tu perfil</h1><p>Hola {name},</p><p>Gracias por enviar tu perfil de profesional. Nuestro equipo lo revisará y te notificaremos una vez que sea aprobado. Este proceso suele tardar entre 24 y 48 horas.</p>',
            profileApprovedSubject: '¡Tu perfil de profesional ha sido aprobado!',
            profileApprovedBody: '<h1>¡Felicidades, {name}!</h1><p>Tu perfil de profesional en teRecomiendo ha sido aprobado. Ahora eres visible para los buscadores y puedes empezar a recibir solicitudes de servicio.</p><p>¡Te deseamos mucho éxito!</p>',
            newServiceRequestSubject: '¡Nueva solicitud de servicio recibida!',
            newServiceRequestBody: '<h1>Tienes una nueva solicitud</h1><p>Hola {name},</p><p>Has recibido una nueva solicitud de servicio de parte de <strong>{seekerName}</strong>. Inicia sesión en tu panel para ver los detalles y responder.</p>',
            ratingReminderSubject: "Recordatorio para calificar nuestro servicio",
            ratingReminderBody: "<h1>¡Hola {seekerName}!</h1><p>Esperamos que estés satisfecho con nuestro servicio. <strong>{professionalName}</strong> te agradecería que te tomaras un momento para dejar una calificación.</p><p>Tu opinión es muy valiosa para nosotros y para la comunidad de teRecomiendo.</p><p><a href='https://terecomiendo.ca'>Haz clic aquí para calificar</a></p><p>¡Gracias!</p>"
        },
        recommender: {
            jobPublishedSubject: 'Has publicado una nueva oferta de empleo',
            jobPublishedBody: '<h1>¡Oferta Publicada!</h1><p>Hola {name},</p><p>Tu oferta de empleo "<strong>{jobTitle}</strong>" ha sido publicada correctamente. Ahora está pendiente de verificación por parte de un administrador.</p>',
            jobVerifiedSubject: '¡Tu oferta de empleo ha sido verificada!',
            jobVerifiedBody: '<h1>¡Oferta Verificada!</h1><p>Hola {name},</p><p>Tu oferta de empleo "<strong>{jobTitle}</strong>" ha sido verificada por nuestro equipo. ¡Gracias por tu contribución! Has ganado ${amount} por esta acción.</p>',
            hireConfirmedSubject: '¡Un candidato ha sido contratado!',
            hireConfirmedBody: '<h1>¡Felicidades, {name}!</h1><p>El candidato <strong>{seekerName}</strong> ha sido contratado para el puesto "<strong>{jobTitle}</strong>". ¡Has ganado ${amount} por esta contratación confirmada!</p>',
            forwardedToCompanySubject: 'Nuevo candidato para su oferta [Ref: {applicationId}]',
            forwardedToCompanyBody: `
              <p>Hola {companyName},</p>
              <p>El usuario <strong>{seekerName}</strong> se ha postulado a su vacante: <strong>{jobTitle}</strong>, a través de nuestra plataforma teRecomiendo.</p>
              <hr>
              <h3>Datos del candidato:</h3>
              <ul>
                <li><strong>Nombre:</strong> {seekerName}</li>
                <li><strong>Email:</strong> {seekerEmail}</li>
                <li><strong>Teléfono:</strong> {seekerPhone}</li>
              </ul>
              <p><strong>Carta de presentación:</strong></p>
              <p><em>{coverLetter}</em></p>
              <p><strong>Documento adjunto:</strong> <a href="{cvUrl}">Ver Hoja de Vida</a></p>
              <hr>
              <h3>Recomendador:</h3>
              <ul>
                <li><strong>Nombre:</strong> {recommenderName}</li>
                <li><strong>Email:</strong> {recommenderEmail}</li>
                <li><strong>Teléfono:</strong> {recommenderPhone}</li>
              </ul>
              <hr>
              <p><strong>Para facilitar el proceso, puede responder directamente a este correo indicando alguna de las siguientes opciones en el asunto para actualizar el estado del candidato en nuestra plataforma:</strong></p>
              <ul>
                <li><strong>INTERESADO</strong> — Para indicar que desea contactar al candidato.</li>
                <li><strong>PARA ENTREVISTA</strong> — Para indicar que el candidato avanza a entrevista.</li>
                <li><strong>NO SELECCIONADO</strong> — Para indicar que el candidato no cumple con el perfil.</li>
              </ul>
              <p>Su respuesta será registrada automáticamente para mantener la trazabilidad del proceso.</p>
              <br>
              <p>Muchas gracias,<br><strong>Te Recomiendo</strong><br><em>La plataforma que conecta a las personas con las oportunidades</em></p>
            `,
        }
    },
    help: {
      title: 'Centro de Ayuda',
      backToDashboard: 'Volver al Panel',
      seeker: {
        title: 'Ayuda para Buscadores',
        description: 'Encuentra respuestas a las preguntas más comunes sobre cómo encontrar empleos y profesionales.',
        faqs: [
          { q: '¿Cómo busco empleos o profesionales?', a: 'En la sección "Búsqueda Avanzada" de tu panel, puedes elegir entre dos pestañas: "Profesionales" y "Empleos". Utiliza los campos de búsqueda para filtrar por nombre, especialidad, palabra clave o ciudad y haz clic en "Buscar" para ver los resultados.' },
          { q: '¿Qué significa el icono del corazón ❤️ junto a una oferta de empleo?', a: 'Ese es el botón de "Favoritos". Puedes hacer clic en él para guardar las ofertas de empleo que más te interesen y revisarlas más tarde sin tener que volver a buscarlas.' },
          { q: '¿Cómo me postulo a una oferta de empleo?', a: 'Una vez que encuentres una oferta que te interese, haz clic en "Ver Detalles". Se abrirá una ventana con la información completa. Si la oferta requiere ser desbloqueada, tendrás la opción de hacerlo. Luego, podrás completar el formulario de postulación adjuntando tu hoja de vida (CV) y una carta de presentación opcional.' },
          { q: '¿Cómo puedo saber en qué estado se encuentra mi postulación?', a: 'En tu panel, ve a la sección "Mis Postulaciones de Empleo". Cada postulación tiene un "Seguimiento de la Postulación" visual que te muestra en qué etapa se encuentra, desde que la envías hasta que la empresa toma una decisión.' },
          { q: '¿Puedo modificar mi postulación después de enviarla?', a: 'Sí. En "Mis Postulaciones de Empleo", puedes hacer clic en el botón "Editar" (icono de lápiz) para actualizar tu carta de presentación o adjuntar una nueva versión de tu hoja de vida.' },
          { q: '¿Cómo puedo calificar al recomendador de un empleo?', a: 'En la lista de "Mis Postulaciones de Empleo", verás un botón de "Calificar" en cada postulación. Al hacer clic, podrás dejar una calificación por estrellas para el recomendador que publicó esa oferta.' },
          { q: '¿Cómo solicito un servicio a un profesional?', a: 'Después de buscar y encontrar un profesional, haz clic en el botón "Ver y Contactar". Se abrirá una ventana donde podrás ver su perfil completo y llenar un formulario para enviarle una solicitud. Puedes detallar el motivo, la descripción, fecha, hora, tu ubicación e incluso adjuntar una foto para dar más contexto.' },
          { q: '¿Qué significan los estados "En Proceso", "Aceptada" y "Completado" en mis solicitudes?', a: 'En Proceso: Tu solicitud ha sido enviada y está esperando que el profesional la vea y la acepte. Aceptada: ¡Buenas noticias! El profesional ha desbloqueado tu solicitud y probablemente se pondrá en contacto contigo pronto. Completado: El servicio ha sido realizado y marcado como finalizado por el profesional.' },
          { q: '¿Cómo puedo calificar a un profesional después de recibir un servicio?', a: 'Una vez que un profesional marque el servicio como "Completado", aparecerá un botón de "Calificar" en esa solicitud dentro de tu panel de "Mis Solicitudes de Servicio".' },
          { q: '¿Cómo actualizo mi información personal o mi foto de perfil?', a: 'En la tarjeta "Mi Perfil" de tu panel, haz clic en el botón "Editar Perfil". Podrás actualizar tu nombre, número de teléfono, ciudad, foto y otros datos personales.' },
          { q: '¿Puedo cancelar una solicitud de servicio que ya envié?', a: 'Sí. Mientras una solicitud de servicio esté "En Proceso", verás un botón de "Cancelar" (icono de papelera) que te permitirá anularla si ya no necesitas el servicio.' },
          { q: '¿Puedo eliminar de mi historial las solicitudes ya completadas?', a: 'Sí. Una vez que un servicio ha sido "Completado" y lo has "Calificado", aparecerá un botón de "Eliminar" para que puedas limpiar tu historial y mantener tu panel organizado.' }
        ]
      },
      professional: {
        title: 'Ayuda para Profesionales',
        description: 'Respuestas sobre cómo gestionar tu perfil, servicios y solicitudes de clientes.',
        faqs: [
          { q: '¿Cómo edito mi perfil?', a: 'En tu panel, haz clic en el botón "Editar Perfil". Podrás actualizar tu especialidad, biografía, servicios, foto y datos de contacto. No olvides subir tu documento de identidad para la verificación.' },
          { q: '¿Por qué mi perfil está "pendiente de revisión"?', a: 'Todos los profilos nuevos o modificados pasan por un proceso de revisión por parte de nuestros administradores para garantizar la calidad y seguridad de la plataforma. Este proceso suele tardar 24-48 horas.' },
          { q: '¿Cómo veo los datos de un cliente que me solicitó un servicio?', a: 'Las solicitudes nuevas aparecen con los datos del cliente bloqueados. Para desbloquearlos, necesitas tener una membresía activa o realizar un pago único por esa solicitud. Haz clic en "Ver Datos del Cliente" para ver las opciones.' },
          { q: '¿Cómo marco un servicio como finalizado?', a: 'Una vez que hayas desbloqueado y contactado al cliente y el servicio se haya completado, ve a la solicitud en tu panel y haz clic en "Finalizar Servicio". Podrás indicar la fecha de finalización y calificar al cliente.' }
        ]
      },
      recommender: {
        title: 'Ayuda para Recomendadores',
        description: 'Aprende a publicar empleos, gestionar tus ganancias y sacar el máximo provecho de la plataforma.',
        faqs: [
          { q: '¿Cómo publico una nueva oferta de empleo?', a: 'En tu panel, encontrarás el formulario "Publicar Nuevo Empleo". Rellena todos los detalles del empleo como el título, la empresa y la descripción, y haz clic en "Publicar Empleo".' },
          { q: '¿Cómo gano dinero como recomendador?', a: 'Ganas dinero de varias formas: una cantidad por cada empleo que publicas y es verificado, otra por cada postulación que recibe tu oferta, y una comisión mayor si un candidato es contratado. Puedes ver las tarifas en la sección "Programa Oficial de Recomendadores".' },
          { q: '¿Dónde veo mis ganancias?', a: 'En la tarjeta "Mis Ganancias" en tu panel, puedes ver un resumen de tus ganancias pendientes y pagadas, así como el historial de pagos que has recibido.' },
          { q: '¿Qué significa que un empleo está "pendiente de verificación"?', a: 'Significa que un administrador está revisando tu publicación para asegurarse de que es una oferta de empleo real y cumple con nuestras políticas. Una vez verificada, recibirás tu ganancia correspondiente.' },
          { q: '¿Cómo hago seguimiento a una postulación para saber si fue contratado?', a: 'En tu panel, en la sección "Mis Empleos Publicados", haz clic en el botón "Postulantes" de una oferta. Si un administrador ha confirmado una contratación, verás una etiqueta de "CONTRATADO" junto al nombre del candidato.' }
        ]
      }
    }
  },
  en: {
    // General
    language: 'Language',
    loading: 'Loading...',
    saveChanges: 'Save Changes',
    saving: 'Saving...',
    cancel: 'Cancel',
    edit: 'Edit',
    delete: 'Delete',
    close: 'Close',
    confirm: 'Confirm',
    notification: 'Notification',
    page: 'Page',
    of: 'of',
    previous: 'Previous',
    next: 'Next',
    na: 'N/A',
    yes: 'Yes',
    no: 'No',
    days: 'days',
    
    // Login
    welcomeBack: 'Welcome Back',
    createYourAccountIn: 'Create your account on teRecomiendo',
    connectingTalent: 'Connecting talent with opportunities.',
    selectUserType: '1. Select your user type',
    recommenderDescription: 'Recommend jobs and help connect talent.',
    seekerDescription: 'Find professionals and jobs.',
    professionalDescription: 'Showcase your profile and connect with clients.',
    name: 'Name',
    email: 'Email',
    password: 'Password',
    showPassword: 'Show password',
    hidePassword: 'Hide password',
    createAccount: 'Create Account',
    login: 'Login',
    alreadyHaveAccount: 'Already have an account?',
    dontHaveAccount: "Don't have an account?",
    signIn: 'Sign In',
    signUp: 'Sign Up',
    forgotPassword: 'Forgot your password?',
    resetPassword: 'Reset Password',
    resetLinkSent: 'A password reset link has been sent to your email.',
    
    // Errors
    errorAllFields: 'Please fill in all fields and select a role.',
    errorEnterEmailPass: 'Please enter email and password.',
    errorEmailInUse: 'This email is already in use.',
    errorInvalidCredential: 'Incorrect email or password.',
    errorWeakPassword: 'Password must be at least 6 characters long.',
    errorDefault: 'An error occurred. Please try again.',

    // Header
    openUserMenu: 'Open user menu',
    logout: 'Logout',
    help_nav: 'Help',

    // Dashboards
    recommenderDashboard: 'Recommender Dashboard',
    seekerDashboard: 'Seeker Dashboard',
    professionalDashboard: 'Professional Dashboard',
    adminDashboard: 'Admin Dashboard',
    unrecognizedRole: 'Unrecognized user role.',
    
    // Settings Dashboard
    settings: {
      title: 'Settings',
      languageSettings: 'Language Settings',
      selectLanguage: 'Select your preferred language.',
      backToDashboard: 'Back to Dashboard',
      english: 'English',
      spanish: 'Spanish',
      french: 'French',
      security: 'Security',
      changePassword: 'Change Password',
      changePasswordDescription: 'Update your password to keep your account secure.',
      currentPassword: 'Current Password',
      newPassword: 'New Password',
      confirmNewPassword: 'Confirm New Password',
      updatePassword: 'Update Password',
      passwordMismatch: 'New passwords do not match.',
      passwordChangedSuccess: 'Password changed successfully!',
      reauthenticationNeeded: 'Please enter your current password to confirm the changes.',
      changeRoleTitle: 'Change User Role',
      changeRoleDescription: 'If you selected the wrong role during registration, you can change it here. Warning: this will reset data specific to your current role (profile, posts, etc.).',
      currentRole: 'Current Role',
      newRole: 'New Role',
      updateRole: 'Update Role',
      confirmRoleChangeTitle: 'Confirm Role Change',
      confirmRoleChangeMessage: 'Are you sure you want to change your role from "{oldRole}" to "{newRole}"?',
      confirmRoleChangeWarning: 'All data associated with your current role (such as professional profile, published jobs, etc.) will be permanently deleted.',
      confirmRoleChangeButton: 'Yes, change role',
      roleChangedSuccess: 'Role updated successfully! You will be logged out. Please log in again.',
      roleChangedError: 'Error changing role.',
    },

    // Recommender Dashboard
    recommender: {
      dashboardTitle: 'Recommender Dashboard',
      publishNewJob: 'Publish New Job',
      publishJobDescription: 'Know of an amazing job opportunity? Share it with the professional community.',
      jobTitle: 'Job Title',
      jobTitlePlaceholder: 'e.g., Frontend Developer',
      companyName: 'Company Name',
      companyNamePlaceholder: 'e.g., Tech Solutions Inc.',
      city: 'City',
      cityPlaceholder: 'e.g., Madrid',
      areaCodeOptional: 'Area Code (Optional)',
      areaCodePlaceholder: 'e.g., 28001',
      jobDescription: 'Job Description',
      jobDescriptionPlaceholder: 'Describe the responsibilities, requirements, etc.',
      jobType: 'Job Type',
      fullTime: 'Full Time',
      partTime: 'Part Time',
      remote: 'Remote',
      salaryOptional: 'Salary (Optional)',
      amount: 'Amount',
      amountPlaceholder: 'e.g., 50000',
      paymentType: 'Payment Type',
      perYear: 'Per Year',
      perHour: 'Per Hour',
      contactInfoOptional: 'Contact Information (Optional)',
      contactPerson: 'Contact Person',
      contactPersonPlaceholder: 'e.g., John Doe',
      contactPhone: 'Contact Phone',
      contactPhonePlaceholder: 'e.g., +1 234 567 890',
      contactEmail: 'Contact Email',
      contactEmailPlaceholder: 'e.g., contact@company.com',
      functionsToPerform: 'Functions to Perform',
      addNewFunctionPlaceholder: 'Add new function',
      add: 'Add',
      publishJob: 'Publish Job',
      publishing: 'Publishing...',
      myPublishedJobs: 'My Published Jobs',
      searchByTitle: 'Search by title...',
      searchByCompany: 'Search by company...',
      applicant: 'applicant',
      applicants: 'applicants',
      jobPublishedSuccessfully: 'Job published successfully!',
      errorPublishingJob: 'An error occurred while publishing the job.',
      profileUpdatedSuccessfully: 'Profile updated successfully.',
      errorUpdatingProfile: 'Error updating profile.',
      photoCaptured: 'Photo captured. Do not forget to save changes.',
      jobUpdatedSuccessfully: 'Job updated successfully.',
      couldNotUpdateJob: 'Could not update job.',
      deletionRequestSent: 'Deletion request sent to administrator.',
      recommenderProfile: 'Recommender Profile',
      noPhone: 'No phone',
      opinion: 'opinion',
      opinions: 'opinions',
      publishedJobs: 'Published jobs',
      editProfile: 'Edit Profile',
      officialRecommendersProgram: 'Official Recommenders Program',
      recommenderProgramDescription: 'Participate as a Certified Recommender and help more people access real job opportunities, while earning benefits for your contribution.',
      programBenefits: 'Program benefits:',
      benefitPerJob: 'for each verified and real job.',
      benefitPerApplication: 'for each candidate who applies through your link.',
      benefitPerHire: 'for each confirmed hire thanks to your recommendation.',
      ourCommitment: 'Our Commitment:',
      commitment1: "We verify the employer's reputation.",
      commitment2: 'We evaluate that the job is real.',
      commitment3: 'We confirm that the candidate actually started the job.',
      importantNotice: 'Important: All payments are subject to conditions and prior verifications, such as the truthfulness of the job and confirmation of the effective hiring of the recommended person.',
      communityStrength: 'Your participation strengthens our community and helps build a more effective, transparent, and real work environment.',
      recommendWithConfidence: 'Recommend with confidence!',
      editMyProfile: 'Edit my Profile',
      emailCannotBeChanged: 'The email cannot be changed.',
      phone: 'Phone',
      profilePhoto: 'Profile Photo',
      photoUrlPlaceholder: 'https://example.com/photo.jpg',
      capturePhoto: 'Capture Photo',
      editJob: 'Edit Job',
      applicantsFor: 'Applicants for',
      loadingApplicants: 'Loading applicants...',
      noApplicantsYet: 'There are no applicants for this job yet.',
      requestJobDeletion: 'Request Job Deletion',
      confirmJobDeletion: 'Are you sure you want to request the deletion of the job',
      jobDeletionNotice: 'An administrator must approve this request. The job will not be visible to seekers while the request is pending.',
      yesRequestDeletion: 'Yes, request deletion',
      sending: 'Sending...',
      noJobsFoundWithFilters: 'No jobs found with the current filters.',
      applicantsModalTitle: 'Applicants for',
      coverLetterNone: 'No cover letter.',
      cv: 'CV',
      viewCV: 'View CV',
      hired: 'HIRED',
      approveAndForward: 'Approve and Send',
      rejectApplication: 'Reject',
      updateStatus: 'Update Status',
      selectStatus: 'Select status',
      shareJob: {
        title: "Share Job Offer",
        description: "Share this opportunity on your social networks or copy the link.",
        text: "Check out this job opportunity for {jobTitle} at {companyName} that I found on teRecomiendo!"
      },
      earnings: {
        title: 'My Earnings',
        pending: 'Pending',
        received: 'Received',
        totalGenerated: 'Total Generated',
        paymentHistory: 'Payment History',
        noPaymentsYet: 'You have not received any payments yet.',
        date: 'Date',
        amount: 'Amount',
        proof: 'Proof',
        viewProof: 'View Proof',
        notes: 'Notes',
        noNotes: 'No notes.',
      },
      forwarding: 'Sending...',
      applicationForwarded: 'Application sent to the company.',
      applicationRejected: 'Application rejected.',
      statusUpdated: 'Status updated.',
      errorUpdatingStatus: 'Error updating status.',
      errorForwarding: 'Error sending application.',
      errorRejecting: 'Error rejecting application.',
      companyResponse: 'Company response',
    },

    // Seeker Dashboard
    seeker: {
      dashboardTitle: 'Seeker Dashboard',
      advancedSearch: 'Advanced Search',
      professionals: 'Professionals',
      jobs: 'Jobs',
      searchByName: 'Search by name...',
      searchBySpecialty: 'Search by specialty...',
      searchByKeyword: 'Search by keyword (e.g., role, skill)',
      searchByCity: 'Search by city...',
      search: 'Search',
      searching: 'Searching...',
      professionalsFound: 'professional(s) found',
      jobsFound: 'job(s) found',
      noProfessionalsFound: 'No professionals found.',
      noJobsFound: 'No jobs found.',
      viewProfile: 'View Profile',
      viewAndContact: 'View and Contact',
      viewDetails: 'View Details',
      recommendedBy: 'Recommended by:',
      applicationsOf: 'of',
      applications: 'applications',
      jobFull: 'Applications closed',
      myProfile: 'My Profile',
      notSpecified: 'Not specified',
      editProfile: 'Edit Profile',
      myJobApplications: 'My Job Applications',
      myServiceRequests: 'My Service Requests',
      searchInMyApps: 'Search in my applications...',
      searchInMyRequests: 'Search in my requests...',
      appliedOn: 'Applied on:',
      sentOn: 'Sent on:',
      rate: 'Rate',
      withdraw: 'Withdraw',
      pending: 'Pending',
      cancelRequest: 'Cancel',
      noApplicationsYet: 'You have not applied to any jobs yet.',
      noRequestsYet: 'You have not sent any service requests yet.',
      professionalProfile: 'Professional Profile',
      successfulServices: 'successful services',
      bio: 'Biography',
      noBio: 'No biography.',
      services: 'Services',
      noServicesListed: 'No services listed.',
      contact: 'Contact',
      contactProfessional: 'Contact',
      contactAndProfileTitle: 'Profile and Contact of {name}',
      requestSubject: 'Request subject',
      describeNeed: 'Describe your need',
      attachPhotoOptional: 'Attach a photo (optional)',
      serviceDay: 'Service day',
      serviceTime: 'Service time',
      locationOptional: 'Location (Optional)',
      locationPlaceholder: 'Type an address or share your location',
      share: 'Share',
      shareCurrentLocation: 'Share Current Location',
      confirmRequest: 'Confirm Request',
      jobDetails: 'Job Details',
      unlockAndApply: 'Unlock and Apply',
      premiumAccess: 'Premium Access',
      premiumAccessDescription: 'To view the full company details and apply, choose an option:',
      recommendedOption: 'Recommended Option',
      buyMembership: 'Buy Membership',
      membershipBenefit: 'Access all applications without limits.',
      buyFor: 'Buy for',
      singlePayment: 'Single Payment per Application',
      singlePaymentDescription: 'Unlock this job offer for a single payment of',
      pay: 'Pay',
      applyTo: 'Apply to',
      contactInfo: 'Company Contact Information',
      person: 'Person',
      email: 'Email',
      phone: 'Phone',
      coverLetterOptional: 'Cover Letter (Optional)',
      attachResume: 'Attach Resume (CV)',
      confirmApplication: 'Confirm Application',
      rateRecommender: 'Rate',
      rateProfessional: 'Rate',
      opinionHelps: 'Your opinion helps others make better decisions.',
      opinionCommunity: 'Your opinion is important for building a trustworthy community.',
      sendRating: 'Send Rating',
      editMyProfile: 'Edit my Profile',
      phoneNumber: 'Phone Number',
      address: 'Address',
      areaCode: 'Postal Code',
      documentType: 'Document Type',
      documentNumber: 'Document Number',
      city: 'City',
      profilePhoto: 'Profile Photo',
      selectIdType: 'Select a type',
      cc: 'National ID Card',
      ce: 'Foreigner ID Card',
      passport: 'Passport',
      uploadPhoto: 'Upload Photo',
      changePhoto: 'Change Photo',
      photoPreview: 'Photo Preview',
      editApplication: 'Edit Application for',
      updateResume: 'Update Resume (CV)',
      updateResumeDescription: 'Attach a new file only if you want to replace the previous one',
      withdrawApplication: 'Withdraw Application',
      confirmWithdraw: 'Are you sure you want to withdraw your application for the job',
      actionCannotBeUndone: 'This action cannot be undone.',
      yesWithdraw: 'Yes, withdraw application',
      withdrawing: 'Withdrawing...',
      editRequest: 'Edit Request for {name}',
      requestDetails: 'Need details',
      cancelServiceRequest: 'Cancel Service Request',
      confirmCancelRequest: 'Are you sure you want to cancel your request?',
      noKeep: 'No, keep',
      yesCancel: 'Yes, cancel',
      cancelling: 'Cancelling...',
      locationObtained: 'Location obtained successfully.',
      couldNotGetLocation: 'Could not get location.',
      geolocationNotSupported: 'Geolocation is not supported by this browser.',
      requestSentSuccessfully: 'Request sent successfully!',
      profileUpdatedSuccessfully: 'Profile updated successfully.',
      paymentCompleted: 'Payment completed! You can now apply.',
      errorConfirmingPurchase: 'Error confirming purchase.',
      applicationSentSuccessfully: 'Application sent successfully!',
      ratingSavedSuccessfully: 'Rating saved successfully!',
      couldNotSaveRating: 'Could not save rating.',
      applicationUpdated: 'Application updated.',
      applicationWithdrawnSuccessfully: 'Application withdrawn successfully.',
      requestUpdated: 'Request updated.',
      requestCancelledSuccessfully: 'Request cancelled successfully.',
      paymentError: 'Payment error:',
      loadingPaymentGateway: 'Loading payment gateway...',
      errorSearchingProfessionals: 'Error searching for professionals.',
      errorSearchingJobs: 'Error searching for jobs.',
      shareRecommendation: 'Share Recommendation',
      shareProfessionalMsg: 'Hi! I recommend this excellent professional I found on teRecomiendo:',
      shareRecommenderMsg: 'Hi! Thanks to this recommender I found a great opportunity on teRecomiendo:',
      copyToClipboard: 'Copy link',
      copied: 'Link copied!',
      alreadyApplied: 'Already Applied',
      previewCV: 'Preview CV',
      sendToCompany: 'Send application directly to the company',
      sendCopyToRecommender: 'Send a copy to the recommender',
      atLeastOneOption: 'You must select at least one sending option.',
      applicationConfirmation: 'Application Confirmation',
      confirmationNumber: 'Your confirmation number is:',
      applicationEmailSubject: 'New Application for: {jobTitle}',
      applicationEmailBody: '<h1>New Application Received</h1><p>You have received a new application for the job <strong>{jobTitle}</strong> from <strong>{seekerName}</strong>.</p><p><strong>Cover Letter:</strong></p><p>{coverLetter}</p><p>You can view the candidate\'s CV at the following link: <a href="{cvUrl}">View CV</a></p><p>Thanks,<br>The teRecomiendo Team</p>',
      seekerApplicationEmailBody: '<h1>Confirmation of your Application</h1><p>Hello {seekerName},</p><p>We have successfully received your application for the position of <strong>{jobTitle}</strong> at <strong>{companyName}</strong>.</p><p>Your confirmation number is: <strong>{confirmationNumber}</strong>.</p><p>We wish you the best of luck!</p><p>Thanks,<br>The teRecomiendo Team</p>',
      jobFullEmailSubject: 'Your job offer "{jobTitle}" has reached the applicant limit!',
      jobFullEmailBody: '<h1>Congratulations!</h1><p>Your job offer <strong>{jobTitle}</strong> has reached the maximum number of applicants and is now closed to new applications.</p><p>You can review the candidates from your recommender dashboard.</p><p>Thanks,<br>The teRecomiendo Team</p>',
      applyNow: 'Apply Now',
      errorSubmittingApplication: 'Error submitting application. Please try again.',
      errorNetwork: 'Network error uploading file. Please check your connection and try again.',
      errorUnauthorizedUpload: 'Permission error. Could not upload file.',
      uploadProgress: 'Upload Progress',
      uploading: 'Uploading...',
      processing: 'Processing...',
      companyContactInfo: 'Company Contact Information',
      proceedToApplication: 'Proceed to Application',
      jobUnlockedSuccess: 'Offer unlocked! You can now see the contact details.',
      applicationStatusTracker: 'Application Tracker',
      viewJobOffer: 'View job offer',
      tracker: {
        step1: 'Application Sent',
        step2: 'Recommender Review',
        step3: 'Sent to Company',
        step4: 'Company Response',
      },
      applicationStatus: {
        submitted: 'Application received by the recommender.',
        recommender_rejected: 'The recommender has discarded your profile.',
        forwarded_to_company: 'Your profile was sent to the company!',
        under_review: 'The company is reviewing your profile.',
        interviewing: 'You have been selected for an interview!',
        company_rejected: 'The company has decided not to proceed with your application.',
        hired: 'Congratulations! You have been hired.',
      },
      addToFavorites: 'Add to favorites',
      removeFromFavorites: 'Remove from favorites',
      applicantsProgress: '{count} of {max} applicants',
      requestStatus: {
        in_process: 'In Process',
        accepted: 'Accepted',
        completed: 'Completed',
        cancelled: 'Cancelled',
      },
      deleteRequest: {
        title: 'Delete Completed Request',
        message: 'Are you sure you want to delete this completed and rated request from your history?',
        confirm: 'Yes, delete',
        success: 'Request deleted successfully.',
        error: 'Error deleting request.'
      },
    },
    
    // Professional Dashboard
    professional: {
      dashboardTitle: 'Professional Dashboard',
      profilePending: 'Your profile is pending review by an administrator.',
      profileApproved: 'Congratulations! Your profile has been approved and is now visible to seekers.',
      profileRejected: 'Your profile has been rejected. Please review its content and resubmit it.',
      myPublicProfile: 'My Public Profile',
      addYourSpecialty: 'Add your specialty',
      addYourBio: 'Add a biography to attract clients.',
      contactInfo: 'Contact Information',
      email: 'Email',
      phone: 'Phone',
      notSpecified: 'Not specified',
      services: 'Services',
      addServicesYouOffer: 'Add the services you offer.',
      myAvailability: 'My Availability',
      noAvailability: "You haven't specified your availability.",
      schedule: 'Schedule',
      serviceRequests: 'Service Requests',
      received: 'Received',
      need: 'Need',
      clientData: 'Client Data',
      name: 'Name',
      requestedDate: 'Requested Date',
      requestedTime: 'Requested Time',
      location: 'Location',
      viewOnMap: 'View on map',
      searchOnMap: 'Search on map',
      openChat: 'Open Chat',
      finishService: 'Finish Service',
      clientDataLocked: 'Client Data Locked',
      unlockToView: 'Unlock to view contact details and location.',
      viewClientData: 'View Client Data',
      noActiveRequests: 'You have not received any active service requests yet.',
      attendedServicesHistory: 'History of Attended Services',
      finished: 'Finished',
      ratingGiven: 'Rating Given',
      noFinishedServices: 'You have not finished any services yet.',
      statistics: 'Statistics',
      requestsReceived: 'Requests Received',
      membership: 'Membership',
      active: 'Active',
      inactive: 'Inactive',
      improveVisibility: 'Improve Visibility',
      editProfessionalProfile: 'Edit Professional Profile',
      specialty: 'Specialty',
      specialtyPlaceholder: 'e.g., Full-Stack Developer',
      shortBio: 'Short Biography',
      bioPlaceholder: 'A brief description of yourself and your work.',
      // FIX: Removed duplicate 'phone' key to resolve object literal error.
      phonePlaceholder: 'e.g., +1 234 567 890',
      manageServices: 'Manage Services',
      noServicesAdded: 'No services added.',
      addNewServicePlaceholder: 'Add new service',
      idForVerification: 'Identity Document (for verification)',
      idUploadNotice: 'Uploading a new document will send it for review.',
      unlockContact: 'Unlock Contact',
      unlockContactDescription: 'To view the full client details and contact them, choose an option:',
      recommendedOption: 'Recommended Option',
      acquireMembership: 'Acquire Membership',
      membershipBenefit: 'Access all requests without limits and improve your visibility.',
      viewMembershipPlans: 'View Membership Plans',
      singleUnlockPayment: 'Single Payment for Unlock',
      singleUnlockDescription: 'Unlock this specific request for a single payment of',
      pay: 'Pay',
      acquireMembershipTitle: 'Acquire Membership',
      acquireMembershipDescription: 'Choose a plan to unlock all requests and improve your visibility.',
      daysOfAccess: 'days of unlimited access',
      buyFor: 'Buy for',
      finishServiceTitle: 'Finish Service',
      completionDate: 'Completion Date',
      rateClient: 'Rate Client',
      confirm: 'Confirm',
      confirmDeletion: 'Confirm Deletion',
      confirmDeleteHistory: 'Are you sure you want to delete this record from history? This action cannot be undone.',
      yesDelete: 'Yes, delete',
      editAvailability: 'Edit Availability',
      describeYourSchedule: 'Describe your schedule',
      schedulePlaceholder: 'e.g., Monday to Friday, 9am - 5pm',
      newServiceRequest: 'You have received a new service request!',
      loadingProfile: 'Loading profile...',
      profileSavedForReview: 'Profile saved and sent for review.',
      couldNotSaveProfile: 'Could not save profile.',
      attendanceSaved: 'Service finished and rated successfully.',
      couldNotSaveAttendance: 'Could not save information.',
      completeDateAndRatingError: 'Please complete the date and rating.',
      availabilitySaved: 'Availability saved successfully.',
      couldNotSaveAvailability: 'Could not save availability.',
      recordDeleted: 'Record deleted from history.',
      couldNotDeleteRecord: 'Could not delete record.',
      invalidPhoneNumber: 'The phone number provided is not valid.',
      completedServices: 'Completed Services',
      averageRating: 'Average Rating',
      notYetRated: "Not yet rated",
      remindToRate: "Remind to Rate",
      reminderSent: "Reminder sent successfully.",
      errorSendingReminder: "Error sending reminder.",
    },
    
    // Admin Dashboard
    admin: {
      dashboardTitle: 'Admin Dashboard',
      pendingProfiles: 'Pending Profiles for Review',
      manageMemberships: 'Manage Memberships',
      requestsMonitor: 'Requests Monitor',
      globalJobSettings: 'Global Job Settings',
      jobDeletionRequests: 'Job Deletion Requests',
      configureRecommenderPayouts: 'Configure Recommender Payouts',
      userManagement: 'User Management',
      loading: 'Loading...',
      noPendingProfiles: 'No pending profiles.',
      approve: 'Approve',
      reject: 'Reject',
      noMembershipPlans: 'No membership plans.',
      addMembership: 'Add Membership',
      noServiceRequests: 'No service requests.',
      from: 'From',
      to: 'To',
      status: 'Status',
      maxApplicantsLimit: 'Maximum Applicant Limit',
      maxApplicantsDescription: 'This number will apply to all job offers. Leave blank for no limit.',
      noLimit: 'No limit',
      save: 'Save',
      noPendingDeletions: 'No pending deletion requests.',
      recommender: 'Recommender',
      approveDeletion: 'Approve Deletion',
      rejectDeletion: 'Reject',
      payoutPerVerifiedJob: 'Payout per verified job ($)',
      payoutPerApplication: 'Payout per application ($)',
      payoutPerConfirmedHire: 'Payout per confirmed hire ($)',
      saveConfiguration: 'Save Configuration',
      advancedSearch: 'Advanced Search',
      searchByName: 'Search by name...',
      searchByEmail: 'Search by email...',
      allRoles: 'All Roles',
      tableHeaderName: 'Name',
      tableHeaderEmail: 'Email',
      tableHeaderRole: 'Role',
      tableHeaderVerification: 'Verification',
      tableHeaderActions: 'Actions',
      verificationSent: 'Sent',
      verificationNotSent: 'Not sent',
      removeVerification: 'Remove Verification',
      verify: 'Verify',
      showing: 'Showing',
      of: 'of',
      editUser: 'Edit User',
      role: 'Role',
      editMembership: 'Edit Membership',
      addMembershipTitle: 'Add Membership',
      planName: 'Plan Name',
      price: 'Price ($)',
      durationDays: 'Duration (days)',
      durationDaysHelpText: 'Defines for how many days the membership will be valid after purchase.',
      createPlan: 'Create Plan',
      confirmDeletion: 'Confirm Deletion',
      confirmDeleteUser: 'Are you sure you want to delete',
      deleteUserWarning: 'This action is irreversible and will delete all associated data (profiles, requests, posts, etc.).',
      yesDeleteUser: 'Yes, delete user',
      deleting: 'Deleting...',
      confirmVerificationToggle: 'Are you sure you want to',
      verifying: 'verify',
      unverifying: 'unverify',
      professionalVerified: 'Professional verified successfully.',
      professionalUnverified: 'Professional unverified successfully.',
      couldNotUpdateVerification: 'Could not update verification status.',
      userDeleted: 'User and all associated data have been deleted.',
      errorDeletingUser: 'An error occurred while deleting the user.',
      confirmDeleteMembership: 'Are you sure you want to delete this membership plan?',
      globalSettingsSaved: 'Global settings saved successfully.',
      couldNotSaveGlobalSettings: 'Could not save settings.',
      payoutSettingsSaved: 'Payout settings saved.',
      errorSavingPayoutSettings: 'Error saving settings.',
      jobDeleted: 'Job and associated applications deleted.',
      errorDeletingJob: 'Error deleting job.',
      deletionRejected: 'Deletion request rejected. The job has been reactivated.',
      errorRejectingDeletion: 'Error rejecting request.',
      systemTools: 'System Tools',
      sendTestEmail: 'Send Test Email',
      testEmailDescription: 'Verify the mail server configuration by sending a test message.',
      recipientEmail: "Recipient's Email",
      sendTest: 'Send Test',
      sendingTest: 'Sending...',
      testEmailSent: 'Test email queued. Check the inbox of {email}.',
      testEmailError: 'Error sending test email.',
      invalidEmail: 'Please enter a valid email.',
      subject: 'Subject',
      messageBody: 'Message Body',
      emailDeliveryStatus: 'Email Delivery Status',
      statusPending: 'Pending... Waiting for server response.',
      statusSuccess: 'Success! Email delivered correctly.',
      statusError: 'Error delivering email: {error}',
      editUserTitle: 'Edit User',
      userVerification: 'User Verification',
      verified: 'Verified',
      notVerified: 'Not Verified',
      toggleVerification: 'Toggle Verification',
      userUpdatedSuccess: 'User updated successfully.',
      errorUpdatingUser: 'Error updating user.',
      userVerifiedSuccess: 'User verified.',
      userUnverifiedSuccess: 'User verification removed.',
      errorTogglingVerification: 'Error toggling verification status.',
      viewDetails: "View Details",
      approveProfileTooltip: "Approve profile",
      rejectProfileTooltip: "Reject profile",
      profileDetailsTitle: "Professional Profile Details",
      jobDetailsTitle: "Job Details",
      idDocument: "Identity Document",
      viewIdDocument: "View Document",
      noDocumentUploaded: "No document has been uploaded.",
      actions: {
        deactivate: 'Deactivate',
        activate: 'Activate',
        confirmDeactivate: 'Confirm Deactivation',
        confirmActivate: 'Confirm Activation',
        deactivateMessage: 'Are you sure you want to deactivate {name}? The user will not be able to log in.',
        activateMessage: 'Are you sure you want to activate {name}? The user will be able to log in again.',
      },
      userStatuses: {
        active: 'Active',
        disabled: 'Disabled'
      },
      nav: {
        verifications: 'Verifications',
        hiring: 'Hiring & Payouts',
        users: 'User Management',
        config: 'Settings & Rates',
      },
      management: {
        manageJobs: 'Manage Jobs',
        noUnverifiedJobs: 'No jobs to verify.',
        verifyJob: 'Verify Job',
        manageApplications: 'Manage Applications',
        noPendingHires: 'No pending hires.',
        markAsHired: 'Mark as Hired',
        recommenderPayouts: 'Recommender Payouts',
        noPendingPayouts: 'No pending earnings to pay.',
        pendingAmount: 'Pending Amount',
        registerPayment: 'Register Payment',
        paymentTo: 'Register Payment for',
        amountToPay: 'Amount to Pay',
        paymentNotesOptional: 'Notes (Optional)',
        paymentProofOptional: 'Payment Proof (Optional)',
        paymentProcessing: 'Processing payment...',
        paymentSuccess: 'Payment registered successfully!',
        paymentError: 'Error registering payment.',
        jobVerifiedSuccess: 'Job verified! An earning has been generated.',
        hireConfirmedSuccess: 'Hire confirmed! An earning has been generated.',
        searchPlaceholder: 'Search by candidate, job, or company...',
        tableHeaderCandidate: 'Candidate',
        tableHeaderJob: 'Job',
        tableHeaderRecommender: 'Recommender',
        tableHeaderStatus: 'Status',
        tableHeaderActions: 'Actions',
        updateStatusTitle: 'Update Application Status',
        candidateInfo: 'Candidate Information',
        recommenderInfo: 'Recommender Information',
        viewCV: 'View Resume',
      },
    },
    
    // Shared components
    payment: {
        cardNumber: 'Card Number',
        expiry: 'Expiration (MM/YY)',
        payNow: 'Pay now',
        processing: 'Processing...',
        error: {
            fillAllFields: 'Please complete all card fields.'
        }
    },
    publicJobView: {
      jobNotFound: "Job offer not found.",
      errorLoadingJob: "Error loading job offer.",
      applyNowLogin: "Log in to Apply"
    },

    // Email Templates
    emails: {
        welcomeSubject: 'Welcome to teRecomiendo!',
        welcomeBodySeeker: `
          <h1>Welcome to teRecomiendo! 👋</h1>
          <p>Thank you for joining the platform where your job search becomes clearer, more direct, and more effective.</p>
          <p>Here you can:</p>
          <ul>
            <li>✅ Access real opportunities</li>
            <li>✅ Apply with the support of a recommender</li>
            <li>✅ Receive notifications on the status of your applications</li>
            <li>✅ Connect with companies looking for talent like you</li>
            <li>✅ Connect with professionals offering services</li>
          </ul>
          <p>This is the first step towards a new professional opportunity.<br>We are happy to have you here!</p>
          <p>👉 Go to your dashboard: <a href="https://terecomiendo.ca">https://terecomiendo.ca</a></p>
        `,
        welcomeBodyRecommender: `
          <h1>Welcome to teRecomiendo! 🙌</h1>
          <p>Thank you for joining as a recommender and being part of a network that helps others find work and earn commissions.</p>
          <p>On our platform, you can:</p>
          <ul>
            <li>✅ Publish job opportunities</li>
            <li>✅ Recommend candidates and help them apply</li>
            <li>✅ Receive notifications when your recommended candidates apply</li>
            <li>✅ Generate income through your publications</li>
          </ul>
          <p>Your role is key to creating connections that generate real opportunities.<br>Thank you for contributing to this community!</p>
          <p>👉 Access your account: <a href="https://terecomiendo.ca">https://terecomiendo.ca</a></p>
        `,
        welcomeBodyProfessional: `
          <h1>Welcome to teRecomiendo! 🏢✨</h1>
          <p>Thank you for joining as a professional and being part of a network that helps others solve problems and meet professional needs.</p>
          <p>On our platform, you can:</p>
          <ul>
            <li>✅ Create and offer verified services</li>
            <li>✅ Connect with people who need real services</li>
            <li>✅ Easily manage applications from your email</li>
            <li>✅ Find business opportunities</li>
          </ul>
          <p>You are now part of a community that unites people's talent with opportunities.</p>
          <p>👉 Enter the business portal: <a href="https://terecomiendo.ca">https://terecomiendo.ca</a></p>
        `,
        seekerToCompany: {
            subject: 'New candidate number({applicationId}) for your offer published by a recommender on our platform',
            body: `
                <h1>Automatic message from Te recomiendo.</h1>
                <p>Hello {companyName},</p>
                <p>The user <strong>{seekerName}</strong> has applied to your vacancy: <strong>{jobTitle}</strong>.</p>
                <hr>
                <h3>Candidate details:</h3>
                <ul>
                    <li><strong>Name:</strong> {seekerName}</li>
                    <li><strong>Email:</strong> {seekerEmail}</li>
                    <li><strong>Phone:</strong> {seekerPhone}</li>
                    <li><strong>Attached document:</strong> <a href="{cvUrl}">View Resume</a></li>
                </ul>
                <hr>
                <h3>Recommender:</h3>
                <ul>
                    <li><strong>Name:</strong> {recommenderName}</li>
                    <li><strong>Email:</strong> {recommenderEmail}</li>
                    <li><strong>Phone:</strong> {recommenderPhone}</li>
                </ul>
                <hr>
                <p>To facilitate the process, you can reply directly to this email indicating one of the following options:</p>
                <ol>
                    <li><strong>INTERESTED</strong> — I wish to contact the candidate</li>
                    <li><strong>FOR INTERVIEW</strong> — Send suggested date and time</li>
                    <li><strong>NOT SELECTED</strong> — Does not meet the profile</li>
                    <li><strong>POSITION FILLED</strong> — We have hired the candidate</li>
                </ol>
                <p>Your response will be automatically registered on the platform to maintain traceability.</p>
                <br>
                <p>Thank you very much,<br><strong>Te Recomiendo</strong><br><em>Your platform that unites talents with job opportunities.</em></p>
                <p><a href="https://terecomiendo.ca">https://terecomiendo.ca</a></p>
            `
        },
        seekerToRecommender: {
            subject: 'A candidate has applied to your offer: {jobTitle}',
            body: `
                <h1>Application Notification</h1>
                <p>Hello {recommenderName},</p>
                <p>The candidate <strong>{seekerName}</strong> has applied to the job offer "<strong>{jobTitle}</strong>" that you published.</p>
                <p><strong>Cover letter:</strong></p>
                <p><em>{coverLetter}</em></p>
                <p><strong>Attached document:</strong> <a href="{cvUrl}">View Resume</a></p>
                <p>Thank you for your contribution to the community.</p>
            `
        },
        failedLoginsWarningSubject: 'Security Alert: Login attempts on your account',
        failedLoginsWarningBody: '<h1>Security Alert</h1><p>Hello,</p><p>We have detected multiple failed login attempts for your account. If it was not you, we recommend that you reset your password immediately.</p>',
        passwordChangedSubject: 'Password Change Confirmation',
        passwordChangedBody: '<h1>Your password has been changed</h1><p>Hello {name},</p><p>This email confirms that your account password has been successfully changed. If you did not make this change, please contact our support immediately.</p>',
        professional: {
            profileSubmittedSubject: 'Your professional profile is under review',
            profileSubmittedBody: '<h1>We have received your profile</h1><p>Hello {name},</p><p>Thank you for submitting your professional profile. Our team will review it and notify you once it is approved. This process usually takes 24 to 48 hours.</p>',
            profileApprovedSubject: 'Your professional profile has been approved!',
            profileApprovedBody: '<h1>Congratulations, {name}!</h1><p>Your professional profile on teRecomiendo has been approved. You are now visible to seekers and can start receiving service requests.</p><p>We wish you much success!</p>',
            newServiceRequestSubject: 'New service request received!',
            newServiceRequestBody: '<h1>You have a new request</h1><p>Hello {name},</p><p>You have received a new service request from <strong>{seekerName}</strong>. Log in to your dashboard to view the details and respond.</p>',
            ratingReminderSubject: "Reminder to rate our service",
            ratingReminderBody: "<h1>Hello {seekerName}!</h1><p>We hope you were satisfied with our service. <strong>{professionalName}</strong> would appreciate it if you took a moment to leave a rating.</p><p>Your opinion is very valuable to us and to the teRecomiendo community.</p><p><a href='https://terecomiendo.ca'>Click here to rate</a></p><p>Thank you!</p>"
        },
        recommender: {
            jobPublishedSubject: 'You have published a new job offer',
            jobPublishedBody: '<h1>Offer Published!</h1><p>Hello {name},</p><p>Your job offer "<strong>{jobTitle}</strong>" has been published successfully. It is now pending verification by an administrator.</p>',
            jobVerifiedSubject: 'Your job offer has been verified!',
            jobVerifiedBody: '<h1>Offer Verified!</h1><p>Hello {name},</p><p>Your job offer "<strong>{jobTitle}</strong>" has been verified by our team. Thank you for your contribution! You have earned ${amount} for this action.</p>',
            hireConfirmedSubject: 'A candidate has been hired!',
            hireConfirmedBody: '<h1>Congratulations, {name}!</h1><p>The candidate <strong>{seekerName}</strong> has been hired for the position "<strong>{jobTitle}</strong>". You have earned ${amount} for this confirmed hire!</p>',
            forwardedToCompanySubject: 'New candidate for your offer [Ref: {applicationId}]',
            forwardedToCompanyBody: `
              <p>Hello {companyName},</p>
              <p>The user <strong>{seekerName}</strong> has applied to your vacancy: <strong>{jobTitle}</strong>, through our platform teRecomiendo.</p>
              <hr>
              <h3>Candidate details:</h3>
              <ul>
                <li><strong>Name:</strong> {seekerName}</li>
                <li><strong>Email:</strong> {seekerEmail}</li>
                <li><strong>Phone:</strong> {seekerPhone}</li>
              </ul>
              <p><strong>Cover letter:</strong></p>
              <p><em>{coverLetter}</em></p>
              <p><strong>Attached document:</strong> <a href="{cvUrl}">View Resume</a></p>
              <hr>
              <h3>Recommender:</h3>
              <ul>
                <li><strong>Name:</strong> {recommenderName}</li>
                <li><strong>Email:</strong> {recommenderEmail}</li>
                <li><strong>Phone:</strong> {recommenderPhone}</li>
              </ul>
              <hr>
              <p><strong>To facilitate the process, you can reply directly to this email indicating one of the following options in the subject to update the candidate's status on our platform:</strong></p>
              <ul>
                <li><strong>INTERESTED</strong> — To indicate that you want to contact the candidate.</li>
                <li><strong>FOR INTERVIEW</strong> — To indicate that the candidate is moving on to an interview.</li>
                <li><strong>NOT SELECTED</strong> — To indicate that the candidate does not meet the profile.</li>
              </ul>
              <p>Your response will be automatically registered to maintain process traceability.</p>
              <br>
              <p>Thank you very much,<br><strong>Te Recomiendo</strong><br><em>The platform that connects people with opportunities</em></p>
            `,
        }
    },
    help: {
      title: 'Help Center',
      backToDashboard: 'Back to Dashboard',
      seeker: {
        title: 'Help for Seekers',
        description: 'Find answers to the most common questions about finding jobs and professionals.',
        faqs: [
          { q: 'How do I search for jobs or professionals?', a: 'In the "Advanced Search" section of your dashboard, you can choose between two tabs: "Professionals" and "Jobs". Use the search fields to filter by name, specialty, keyword, or city and click "Search" to see the results.' },
          { q: 'What does the heart icon ❤️ next to a job offer mean?', a: 'That is the "Favorites" button. You can click on it to save the job offers that interest you the most and review them later without having to search again.' },
          { q: 'How do I apply for a job offer?', a: 'Once you find an offer that interests you, click on "View Details". A window will open with the complete information. If the offer needs to be unlocked, you will have the option to do so. Then, you can complete the application form by attaching your resume (CV) and an optional cover letter.' },
          { q: 'How can I know the status of my application?', a: 'On your dashboard, go to the "My Job Applications" section. Each application has a visual "Application Tracker" that shows you which stage it is in, from when you send it until the company makes a decision.' },
          { q: 'Can I modify my application after sending it?', a: 'Yes. In "My Job Applications", you can click the "Edit" button (pencil icon) to update your cover letter or attach a new version of your resume.' },
          { q: 'How can I rate the recommender of a job?', a: 'In the "My Job Applications" list, you will see a "Rate" button on each application. By clicking it, you can leave a star rating for the recommender who posted that offer.' },
          { q: 'How do I request a service from a professional?', a: 'After searching for and finding a professional, click the "View and Contact" button. A window will open where you can see their full profile and fill out a form to send them a request. You can detail the reason, description, date, time, your location, and even attach a photo to provide more context.' },
          { q: 'What do the statuses "In Process", "Accepted", and "Completed" mean in my requests?', a: 'In Process: Your request has been sent and is waiting for the professional to see and accept it. Accepted: Good news! The professional has unlocked your request and will probably contact you soon. Completed: The service has been performed and marked as finished by the professional.' },
          { q: 'How can I rate a professional after receiving a service?', a: 'Once a professional marks the service as "Completed", a "Rate" button will appear on that request within your "My Service Requests" panel.' },
          { q: 'How do I update my personal information or profile picture?', a: 'In the "My Profile" card on your dashboard, click the "Edit Profile" button. You can update your name, phone number, city, photo, and other personal data.' },
          { q: 'Can I cancel a service request I have already sent?', a: 'Yes. While a service request is "In Process", you will see a "Cancel" button (trash icon) that will allow you to cancel it if you no longer need the service.' },
          { q: 'Can I delete completed requests from my history?', a: 'Yes. Once a service has been "Completed" and you have "Rated" it, a "Delete" button will appear so you can clear your history and keep your dashboard organized.' }
        ]
      },
      professional: {
        title: 'Help for Professionals',
        description: 'Answers about managing your profile, services, and client requests.',
        faqs: [
          { q: 'How do I edit my profile?', a: 'On your dashboard, click the "Edit Profile" button. You can update your specialty, biography, services, photo, and contact details. Don\'t forget to upload your ID for verification.' },
          { q: 'Why is my profile "pending review"?', a: 'All new or modified profiles go through a review process by our administrators to ensure the quality and security of the platform. This process usually takes 24-48 hours.' },
          { q: 'How do I see the details of a client who requested a service?', a: 'New requests appear with the client\'s data locked. To unlock them, you need an active membership or make a one-time payment for that request. Click on "View Client Data" to see the options.' },
          { q: 'How do I mark a service as completed?', a: 'Once you have unlocked and contacted the client and the service has been completed, go to the request on your dashboard and click "Finish Service". You can indicate the completion date and rate the client.' }
        ]
      },
      recommender: {
        title: 'Help for Recommenders',
        description: 'Learn how to post jobs, manage your earnings, and make the most of the platform.',
        faqs: [
          { q: 'How do I post a new job offer?', a: 'On your dashboard, you will find the "Publish New Job" form. Fill in all the job details such as title, company, and description, and click "Publish Job".' },
          { q: 'How do I earn money as a recommender?', a: 'You earn money in several ways: an amount for each job you post that is verified, another for each application your offer receives, and a larger commission if a candidate is hired. You can see the rates in the "Official Recommenders Program" section.' },
          { q: 'Where can I see my earnings?', a: 'In the "My Earnings" card on your dashboard, you can see a summary of your pending and paid earnings, as well as the history of payments you have received.' },
          { q: 'What does it mean for a job to be "pending verification"?', a: 'It means an administrator is reviewing your post to ensure it is a real job offer and meets our policies. Once verified, you will receive your corresponding earning.' },
          { q: 'How do I track an application to know if they were hired?', a: 'On your dashboard, in the "My Published Jobs" section, click the "Applicants" button for an offer. If an administrator has confirmed a hire, you will see a "HIRED" tag next to the candidate\'s name.' }
        ]
      }
    }
  },
  fr: {
    // General
    language: 'Langue',
    loading: 'Chargement...',
    saveChanges: 'Enregistrer les modifications',
    saving: 'Enregistrement...',
    cancel: 'Annuler',
    edit: 'Modifier',
    delete: 'Supprimer',
    close: 'Fermer',
    confirm: 'Confirmer',
    notification: 'Notification',
    page: 'Page',
    of: 'de',
    previous: 'Précédent',
    next: 'Suivant',
    na: 'N/A',
    yes: 'Oui',
    no: 'Non',
    days: 'jours',
    
    // Login
    welcomeBack: 'Content de vous revoir',
    createYourAccountIn: 'Créez votre compte sur teRecomiendo',
    connectingTalent: 'Connecter les talents avec les opportunités.',
    selectUserType: '1. Sélectionnez votre type d\'utilisateur',
    recommenderDescription: 'Recommandez des emplois et aidez à connecter les talents.',
    seekerDescription: 'Trouvez des professionnels et des emplois.',
    professionalDescription: 'Présentez votre profil et connectez-vous avec des clients.',
    name: 'Nom',
    email: 'E-mail',
    password: 'Mot de passe',
    showPassword: 'Afficher le mot de passe',
    hidePassword: 'Masquer le mot de passe',
    createAccount: 'Créer un compte',
    login: 'Se connecter',
    alreadyHaveAccount: 'Vous avez déjà un compte ?',
    dontHaveAccount: 'Vous n\'avez pas de compte ?',
    signIn: 'Se connecter',
    signUp: 'S\'inscrire',
    forgotPassword: 'Mot de passe oublié ?',
    resetPassword: 'Réinitialiser le mot de passe',
    resetLinkSent: 'Un lien de réinitialisation de mot de passe a été envoyé à votre e-mail.',
    
    // Errors
    errorAllFields: 'Veuillez remplir tous les champs et sélectionner un rôle.',
    errorEnterEmailPass: 'Veuillez saisir votre e-mail et votre mot de passe.',
    errorEmailInUse: 'Cet e-mail est déjà utilisé.',
    errorInvalidCredential: 'E-mail ou mot de passe incorrect.',
    errorWeakPassword: 'Le mot de passe doit comporter au moins 6 caractères.',
    errorDefault: 'Une erreur est survenue. Veuillez réessayer.',

    // Header
    openUserMenu: 'Ouvrir le menu utilisateur',
    logout: 'Se déconnecter',
    help_nav: 'Aide',

    // Dashboards
    recommenderDashboard: 'Tableau de bord du Recommandeur',
    seekerDashboard: 'Tableau de bord du Chercheur',
    professionalDashboard: 'Tableau de bord du Professionnel',
    adminDashboard: "Tableau de bord de l'administrateur",
    unrecognizedRole: 'Rôle d\'utilisateur non reconnu.',
    
    // Settings Dashboard
    settings: {
        title: 'Paramètres',
        languageSettings: 'Paramètres de langue',
        selectLanguage: 'Sélectionnez votre langue préférée.',
        backToDashboard: 'Retour au tableau de bord',
        english: 'Anglais',
        spanish: 'Espagnol',
        french: 'Français',
        security: 'Sécurité',
        changePassword: 'Changer le mot de passe',
        changePasswordDescription: 'Mettez à jour votre mot de passe pour sécuriser votre compte.',
        currentPassword: 'Mot de passe actuel',
        newPassword: 'Nouveau mot de passe',
        confirmNewPassword: 'Confirmer le nouveau mot de passe',
        updatePassword: 'Mettre à jour le mot de passe',
        passwordMismatch: 'Les nouveaux mots de passe ne correspondent pas.',
        passwordChangedSuccess: 'Mot de passe changé avec succès !',
        reauthenticationNeeded: 'Veuillez saisir votre mot de passe actuel pour confirmer les modifications.',
        changeRoleTitle: 'Changer le rôle de l\'utilisateur',
        changeRoleDescription: 'Si vous avez sélectionné le mauvais rôle lors de l\'inscription, vous pouvez le changer ici. Attention : cela réinitialisera les données spécifiques à votre rôle actuel (profil, publications, etc.).',
        currentRole: 'Rôle actuel',
        newRole: 'Nouveau rôle',
        updateRole: 'Mettre à jour le rôle',
        confirmRoleChangeTitle: 'Confirmer le changement de rôle',
        confirmRoleChangeMessage: 'Êtes-vous sûr de vouloir changer votre rôle de "{oldRole}" à "{newRole}" ?',
        confirmRoleChangeWarning: 'Toutes les données associées à votre rôle actuel (comme le profil professionnel, les emplois publiés, etc.) seront définitivement supprimées.',
        confirmRoleChangeButton: 'Oui, changer de rôle',
        roleChangedSuccess: 'Rôle mis à jour avec succès ! Vous allez être déconnecté. Veuillez vous reconnecter.',
        roleChangedError: 'Erreur lors du changement de rôle.',
    },
    
    recommender: {
        dashboardTitle: 'Tableau de bord du Recommandeur',
        publishNewJob: 'Publier une nouvelle offre d\'emploi',
        publishJobDescription: 'Vous connaissez une opportunité d\'emploi incroyable ? Partagez-la avec la communauté des professionnels.',
        jobTitle: 'Titre de l\'emploi',
        jobTitlePlaceholder: 'Ex : Développeur Frontend',
        companyName: 'Nom de l\'entreprise',
        companyNamePlaceholder: 'Ex : Tech Solutions Inc.',
        city: 'Ville',
        cityPlaceholder: 'Ex : Paris',
        areaCodeOptional: 'Code postal (Facultatif)',
        areaCodePlaceholder: 'Ex : 75001',
        jobDescription: 'Description de l\'emploi',
        jobDescriptionPlaceholder: 'Décrivez les responsabilités, les exigences, etc.',
        jobType: 'Type d\'emploi',
        fullTime: 'Temps plein',
        partTime: 'Temps partiel',
        remote: 'À distance',
        salaryOptional: 'Salaire (Facultatif)',
        amount: 'Montant',
        amountPlaceholder: 'Ex : 50000',
        paymentType: 'Type de paiement',
        perYear: 'Par an',
        perHour: 'Par heure',
        contactInfoOptional: 'Informations de contact (Facultatif)',
        contactPerson: 'Personne à contacter',
        contactPersonPlaceholder: 'Ex : Jean Dupont',
        contactPhone: 'Téléphone de contact',
        contactPhonePlaceholder: 'Ex : +33 1 23 45 67 89',
        contactEmail: 'E-mail de contact',
        contactEmailPlaceholder: 'Ex : contact@entreprise.com',
        functionsToPerform: 'Fonctions à réaliser',
        addNewFunctionPlaceholder: 'Ajouter une nouvelle fonction',
        add: 'Ajouter',
        publishJob: 'Publier l\'offre',
        publishing: 'Publication en cours...',
        myPublishedJobs: 'Mes offres publiées',
        searchByTitle: 'Rechercher par titre...',
        searchByCompany: 'Rechercher par entreprise...',
        applicant: 'candidat',
        applicants: 'candidats',
        jobPublishedSuccessfully: 'Offre d\'emploi publiée avec succès !',
        errorPublishingJob: 'Une erreur est survenue lors de la publication de l\'offre.',
        profileUpdatedSuccessfully: 'Profil mis à jour avec succès.',
        errorUpdatingProfile: 'Erreur lors de la mise à jour du profil.',
        photoCaptured: 'Photo capturée. N\'oubliez pas d\'enregistrer les modifications.',
        jobUpdatedSuccessfully: 'Offre d\'emploi mise à jour avec succès.',
        couldNotUpdateJob: 'Impossible de mettre à jour l\'offre d\'emploi.',
        deletionRequestSent: 'Demande de suppression envoyée à l\'administrateur.',
        recommenderProfile: 'Profil du Recommandeur',
        noPhone: 'Pas de téléphone',
        opinion: 'avis',
        opinions: 'avis',
        publishedJobs: 'Offres publiées',
        editProfile: 'Modifier le profil',
        officialRecommendersProgram: 'Programme Officiel des Recommandeurs',
        recommenderProgramDescription: 'Participez en tant que Recommandeur Certifié et aidez plus de personnes à accéder à de réelles opportunités d\'emploi, tout en obtenant des avantages pour votre contribution.',
        programBenefits: 'Avantages du programme :',
        benefitPerJob: 'pour chaque emploi vérifié et réel.',
        benefitPerApplication: 'pour chaque candidat qui postule via votre lien.',
        benefitPerHire: 'pour chaque embauche confirmée grâce à votre recommandation.',
        ourCommitment: 'Notre engagement :',
        commitment1: "Nous vérifions la réputation de l'employeur.",
        commitment2: 'Nous évaluons que l\'emploi est réel.',
        commitment3: 'Nous confirmons que le candidat a réellement commencé le travail.',
        importantNotice: 'Important : Tous les paiements sont soumis à des conditions et à des vérifications préalables, telles que la véracité de l\'emploi et la confirmation de l\'embauche effective de la personne recommandée.',
        communityStrength: 'Votre participation renforce notre communauté et aide à construire un environnement de travail plus efficace, transparent et réel.',
        recommendWithConfidence: 'Recommandez en toute confiance !',
        editMyProfile: 'Modifier mon profil',
        emailCannotBeChanged: 'L\'e-mail ne peut pas être modifié.',
        phone: 'Téléphone',
        profilePhoto: 'Photo de profil',
        photoUrlPlaceholder: 'https://exemple.com/photo.jpg',
        capturePhoto: 'Capturer une photo',
        editJob: 'Modifier l\'offre',
        applicantsFor: 'Candidats pour',
        loadingApplicants: 'Chargement des candidats...',
        noApplicantsYet: 'Aucun candidat pour cette offre pour le moment.',
        requestJobDeletion: 'Demander la suppression de l\'offre',
        confirmJobDeletion: 'Êtes-vous sûr de vouloir demander la suppression de l\'offre',
        jobDeletionNotice: 'Un administrateur doit approuver cette demande. L\'offre ne sera pas visible pour les chercheurs pendant que la demande est en attente.',
        yesRequestDeletion: 'Oui, demander la suppression',
        sending: 'Envoi en cours...',
        noJobsFoundWithFilters: 'Aucune offre d\'emploi trouvée avec les filtres actuels.',
        applicantsModalTitle: 'Candidats pour',
        coverLetterNone: 'Pas de lettre de motivation.',
        cv: 'CV',
        viewCV: 'Voir le CV',
        hired: 'EMBAUCHÉ',
        approveAndForward: 'Approuver et envoyer',
        rejectApplication: 'Rejeter',
        updateStatus: 'Mettre à jour le statut',
        selectStatus: 'Sélectionner le statut',
        shareJob: {
            title: "Partager l'offre d'emploi",
            description: "Partagez cette opportunité sur vos réseaux sociaux ou copiez le lien.",
            text: "Découvrez cette opportunité d'emploi pour {jobTitle} chez {companyName} que j'ai trouvée sur teRecomiendo !"
        },
        earnings: {
            title: 'Mes gains',
            pending: 'En attente',
            received: 'Reçu',
            totalGenerated: 'Total généré',
            paymentHistory: 'Historique des paiements',
            noPaymentsYet: 'Vous n\'avez encore reçu aucun paiement.',
            date: 'Date',
            amount: 'Montant',
            proof: 'Justificatif',
            viewProof: 'Voir le justificatif',
            notes: 'Notes',
            noNotes: 'Sans notes.',
        },
        forwarding: 'Envoi en cours...',
        applicationForwarded: 'Candidature envoyée à l\'entreprise.',
        applicationRejected: 'Candidature rejetée.',
        statusUpdated: 'Statut mis à jour.',
        errorUpdatingStatus: 'Erreur lors de la mise à jour du statut.',
        errorForwarding: 'Erreur lors de l\'envoi de la candidature.',
        errorRejecting: 'Erreur lors du rejet de la candidature.',
        companyResponse: "Réponse de l'entreprise",
    },
    seeker: {
        dashboardTitle: 'Tableau de bord du Chercheur',
        advancedSearch: 'Recherche avancée',
        professionals: 'Professionnels',
        jobs: 'Emplois',
        searchByName: 'Rechercher par nom...',
        searchBySpecialty: 'Rechercher par spécialité...',
        searchByKeyword: 'Rechercher par mot-clé (ex: rôle, compétence)',
        searchByCity: 'Rechercher par ville...',
        search: 'Rechercher',
        searching: 'Recherche en cours...',
        professionalsFound: 'professionnel(s) trouvé(s)',
        jobsFound: 'emploi(s) trouvé(s)',
        noProfessionalsFound: 'Aucun professionnel trouvé.',
        noJobsFound: 'Aucun emploi trouvé.',
        viewProfile: 'Voir le profil',
        viewAndContact: 'Voir et Contacter',
        viewDetails: 'Voir les détails',
        recommendedBy: 'Recommandé par :',
        applicationsOf: 'de',
        applications: 'candidatures',
        jobFull: 'Candidatures fermées',
        myProfile: 'Mon profil',
        notSpecified: 'Non spécifié',
        editProfile: 'Modifier le profil',
        myJobApplications: 'Mes candidatures',
        myServiceRequests: 'Mes demandes de service',
        searchInMyApps: 'Rechercher dans mes candidatures...',
        searchInMyRequests: 'Rechercher dans mes demandes...',
        appliedOn: 'Postulé le :',
        sentOn: 'Envoyée le :',
        rate: 'Évaluer',
        withdraw: 'Retirer',
        pending: 'En attente',
        cancelRequest: 'Annuler',
        noApplicationsYet: 'Vous n\'avez postulé à aucun emploi pour le moment.',
        noRequestsYet: 'Vous n\'avez envoyé aucune demande de service pour le moment.',
        professionalProfile: 'Profil du Professionnel',
        successfulServices: 'services réussis',
        bio: 'Biographie',
        noBio: 'Pas de biographie.',
        services: 'Services',
        noServicesListed: 'Aucun service répertorié.',
        contact: 'Contacter',
        contactProfessional: 'Contacter',
        contactAndProfileTitle: 'Profil et Contact de {name}',
        requestSubject: 'Objet de la demande',
        describeNeed: 'Décrivez votre besoin',
        attachPhotoOptional: 'Joindre une photo (facultatif)',
        serviceDay: 'Jour du service',
        serviceTime: 'Heure du service',
        locationOptional: 'Lieu (Facultatif)',
        locationPlaceholder: 'Saisissez une adresse ou partagez votre position',
        share: 'Partager',
        shareCurrentLocation: 'Partager ma position',
        confirmRequest: 'Confirmer la demande',
        jobDetails: 'Détails de l\'emploi',
        unlockAndApply: 'Débloquer et postuler',
        premiumAccess: 'Accès Premium',
        premiumAccessDescription: 'Pour voir les détails complets de l\'entreprise et postuler, choisissez une option :',
        recommendedOption: 'Option recommandée',
        buyMembership: 'Acheter un abonnement',
        membershipBenefit: 'Accédez à toutes les candidatures de manière illimitée.',
        buyFor: 'Acheter pour',
        singlePayment: 'Paiement unique par candidature',
        singlePaymentDescription: 'Débloquez cette offre d\'emploi pour un paiement unique de',
        pay: 'Payer',
        applyTo: 'Postuler à',
        contactInfo: 'Coordonnées de l\'entreprise',
        person: 'Personne',
        email: 'E-mail',
        phone: 'Téléphone',
        coverLetterOptional: 'Lettre de motivation (Facultatif)',
        attachResume: 'Joindre un CV',
        confirmApplication: 'Confirmer la candidature',
        rateRecommender: 'Évaluer',
        rateProfessional: 'Évaluer',
        opinionHelps: 'Votre avis aide les autres à prendre de meilleures décisions.',
        opinionCommunity: 'Votre avis est important pour construire une communauté de confiance.',
        sendRating: 'Envoyer l\'évaluation',
        editMyProfile: 'Modifier mon profil',
        phoneNumber: 'Numéro de téléphone',
        address: 'Adresse',
        areaCode: 'Code postal',
        documentType: 'Type de document',
        documentNumber: 'Numéro de document',
        city: 'Ville',
        profilePhoto: 'Photo de profil',
        selectIdType: 'Sélectionnez un type',
        cc: 'Carte d\'identité nationale',
        ce: 'Carte de séjour',
        passport: 'Passeport',
        uploadPhoto: 'Télécharger une photo',
        changePhoto: 'Changer de photo',
        photoPreview: 'Aperçu de la photo',
        editApplication: 'Modifier la candidature pour',
        updateResume: 'Mettre à jour le CV',
        updateResumeDescription: 'Joignez un nouveau fichier uniquement si vous souhaitez remplacer le précédent',
        withdrawApplication: 'Retirer la candidature',
        confirmWithdraw: 'Êtes-vous sûr de vouloir retirer votre candidature pour l\'emploi',
        actionCannotBeUndone: 'Cette action est irréversible.',
        yesWithdraw: 'Oui, retirer la candidature',
        withdrawing: 'Retrait en cours...',
        editRequest: 'Modifier la demande pour {name}',
        requestDetails: 'Détails du besoin',
        cancelServiceRequest: 'Annuler la demande de service',
        confirmCancelRequest: 'Êtes-vous sûr de vouloir annuler votre demande ?',
        noKeep: 'Non, conserver',
        yesCancel: 'Oui, annuler',
        cancelling: 'Annulation en cours...',
        locationObtained: 'Position obtenue avec succès.',
        couldNotGetLocation: 'Impossible d\'obtenir la position.',
        geolocationNotSupported: 'La géolocalisation n\'est pas prise en charge par ce navigateur.',
        requestSentSuccessfully: 'Demande envoyée avec succès !',
        profileUpdatedSuccessfully: 'Profil mis à jour avec succès.',
        paymentCompleted: 'Paiement effectué ! Vous pouvez maintenant postuler.',
        errorConfirmingPurchase: 'Erreur lors de la confirmation de l\'achat.',
        applicationSentSuccessfully: 'Candidature envoyée avec succès !',
        ratingSavedSuccessfully: 'Évaluation enregistrée avec succès !',
        couldNotSaveRating: 'Impossible d\'enregistrer l\'évaluation.',
        applicationUpdated: 'Candidature mise à jour.',
        applicationWithdrawnSuccessfully: 'Candidature retirée avec succès.',
        requestUpdated: 'Demande mise à jour.',
        requestCancelledSuccessfully: 'Demande annulée avec succès.',
        paymentError: 'Erreur de paiement :',
        loadingPaymentGateway: 'Chargement de la passerelle de paiement...',
        errorSearchingProfessionals: 'Erreur lors de la recherche de professionnels.',
        errorSearchingJobs: 'Erreur lors de la recherche d\'emplois.',
        shareRecommendation: 'Partager la recommandation',
        shareProfessionalMsg: 'Bonjour ! Je vous recommande cet excellent professionnel que j\'ai trouvé sur teRecomiendo :',
        shareRecommenderMsg: 'Bonjour ! Grâce à ce recommandeur, j\'ai trouvé une excellente opportunité sur teRecomiendo :',
        copyToClipboard: 'Copier le lien',
        copied: 'Lien copié !',
        alreadyApplied: 'Déjà postulé',
        previewCV: 'Aperçu du CV',
        sendToCompany: "Envoyer la candidature directement à l'entreprise",
        sendCopyToRecommender: 'Envoyer une copie au recommandeur',
        atLeastOneOption: "Vous devez sélectionner au moins une option d'envoi.",
        applicationConfirmation: 'Confirmation de candidature',
        confirmationNumber: 'Votre numéro de confirmation est :',
        applicationEmailSubject: 'Nouvelle candidature pour : {jobTitle}',
        applicationEmailBody: '<h1>Nouvelle candidature reçue</h1><p>Vous avez reçu une nouvelle candidature pour l\'emploi <strong>{jobTitle}</strong> de la part de <strong>{seekerName}</strong>.</p><p><strong>Lettre de motivation :</strong></p><p>{coverLetter}</p><p>Vous pouvez consulter le CV du candidat sur le lien suivant : <a href="{cvUrl}">Voir le CV</a></p><p>Merci,<br>L\'équipe de teRecomiendo</p>',
        seekerApplicationEmailBody: '<h1>Confirmation de votre candidature</h1><p>Bonjour {seekerName},</p><p>Nous avons bien reçu votre candidature pour le poste de <strong>{jobTitle}</strong> chez <strong>{companyName}</strong>.</p><p>Votre numéro de confirmation est : <strong>{confirmationNumber}</strong>.</p><p>Nous vous souhaitons bonne chance !</p><p>Merci,<br>L\'équipe de teRecomiendo</p>',
        jobFullEmailSubject: 'Votre offre d\'emploi "{jobTitle}" a atteint la limite de candidats !',
        jobFullEmailBody: '<h1>Félicitations !</h1><p>Votre offre d\'emploi <strong>{jobTitle}</strong> a atteint le nombre maximum de candidats et est maintenant fermée aux nouvelles candidatures.</p><p>Vous pouvez consulter les candidats depuis votre tableau de bord de recommandeur.</p><p>Merci,<br>L\'équipe de teRecomiendo</p>',
        applyNow: 'Postuler maintenant',
        errorSubmittingApplication: 'Erreur lors de l\'envoi de la candidature. Veuillez réessayer.',
        errorNetwork: 'Erreur réseau lors du téléversement du fichier. Veuillez vérifier votre connexion et réessayer.',
        errorUnauthorizedUpload: 'Erreur de permission. Impossible de téléverser le fichier.',
        uploadProgress: 'Progression du téléversement',
        uploading: 'Téléversement en cours...',
        processing: 'Traitement en cours...',
        companyContactInfo: 'Coordonnées de l\'entreprise',
        proceedToApplication: 'Procéder à la candidature',
        jobUnlockedSuccess: 'Offre débloquée ! Vous pouvez maintenant voir les coordonnées.',
        applicationStatusTracker: 'Suivi de la candidature',
        viewJobOffer: "Voir l'offre d'emploi",
        tracker: {
            step1: 'Candidature envoyée',
            step2: 'Examen du Recommandeur',
            step3: 'Envoyée à l\'entreprise',
            step4: 'Réponse de l\'entreprise',
        },
        applicationStatus: {
            submitted: 'Candidature reçue par le recommandeur.',
            recommender_rejected: 'Le recommandeur a écarté votre profil.',
            forwarded_to_company: 'Votre profil a été envoyé à l\'entreprise !',
            under_review: "L'entreprise examine votre profil.",
            interviewing: 'Vous avez été sélectionné pour un entretien !',
            company_rejected: "L'entreprise a décidé de ne pas poursuivre avec votre candidature.",
            hired: 'Félicitations ! Vous avez été embauché.',
        },
        addToFavorites: 'Ajouter aux favoris',
        removeFromFavorites: 'Retirer des favoris',
        applicantsProgress: '{count} sur {max} candidats',
        requestStatus: {
            in_process: 'En cours',
            accepted: 'Acceptée',
            completed: 'Terminée',
            cancelled: 'Annulée',
        },
        deleteRequest: {
            title: 'Supprimer la demande terminée',
            message: 'Êtes-vous sûr de vouloir supprimer cette demande terminée et évaluée de votre historique ?',
            confirm: 'Oui, supprimer',
            success: 'Demande supprimée avec succès.',
            error: 'Erreur lors de la suppression de la demande.'
        },
    },

    // Professional Dashboard
    professional: {
        dashboardTitle: 'Tableau de bord du Professionnel',
        profilePending: 'Votre profil est en attente de révision par un administrateur.',
        profileApproved: 'Félicitations ! Votre profil a été approuvé et est maintenant visible pour les chercheurs.',
        profileRejected: 'Votre profil a été rejeté. Veuillez vérifier son contenu et le soumettre à nouveau.',
        myPublicProfile: 'Mon profil public',
        addYourSpecialty: 'Ajoutez votre spécialité',
        addYourBio: 'Ajoutez une biographie pour attirer des clients.',
        contactInfo: 'Coordonnées',
        email: 'E-mail',
        phone: 'Téléphone',
        notSpecified: 'Non spécifié',
        services: 'Services',
        addServicesYouOffer: 'Ajoutez les services que vous proposez.',
        myAvailability: 'Ma disponibilité',
        noAvailability: "Vous n'avez pas spécifié votre disponibilité.",
        schedule: 'Horaire',
        serviceRequests: 'Demandes de service',
        received: 'Reçues',
        need: 'Besoin',
        clientData: 'Données du client',
        name: 'Nom',
        requestedDate: 'Date demandée',
        requestedTime: 'Heure demandée',
        location: 'Lieu',
        viewOnMap: 'Voir sur la carte',
        searchOnMap: 'Rechercher sur la carte',
        openChat: 'Ouvrir le chat',
        finishService: 'Terminer le service',
        clientDataLocked: 'Données du client verrouillées',
        unlockToView: 'Déverrouillez pour voir les coordonnées et l\'emplacement.',
        viewClientData: 'Voir les données du client',
        noActiveRequests: 'Vous n\'avez encore reçu aucune demande de service active.',
        attendedServicesHistory: 'Historique des services rendus',
        finished: 'Terminé',
        ratingGiven: 'Évaluation attribuée',
        noFinishedServices: 'Vous n\'avez encore terminé aucun service.',
        statistics: 'Statistiques',
        requestsReceived: 'Demandes reçues',
        membership: 'Abonnement',
        active: 'Actif',
        inactive: 'Inactif',
        improveVisibility: 'Améliorer la visibilité',
        editProfessionalProfile: 'Modifier le profil professionnel',
        specialty: 'Spécialité',
        specialtyPlaceholder: 'Ex : Développeur Full-Stack',
        shortBio: 'Biographie courte',
        bioPlaceholder: 'Une brève description de vous et de votre travail.',
        // FIX: Removed duplicate 'phone' key to resolve object literal error.
        phonePlaceholder: 'Ex : +33 1 23 45 67 89',
        manageServices: 'Gérer les services',
        noServicesAdded: 'Aucun service ajouté.',
        addNewServicePlaceholder: 'Ajouter un nouveau service',
        idForVerification: 'Pièce d\'identité (pour vérification)',
        idUploadNotice: 'Le téléversement d\'un nouveau document l\'enverra pour révision.',
        unlockContact: 'Déverrouiller le contact',
        unlockContactDescription: 'Pour voir les détails complets du client et le contacter, choisissez une option :',
        recommendedOption: 'Option recommandée',
        acquireMembership: 'Acquérir un abonnement',
        membershipBenefit: 'Accédez à toutes les demandes de manière illimitée et améliorez votre visibilité.',
        viewMembershipPlans: 'Voir les plans d\'abonnement',
        singleUnlockPayment: 'Paiement unique pour déverrouillage',
        singleUnlockDescription: 'Déverrouillez cette demande spécifique pour un paiement unique de',
        pay: 'Payer',
        acquireMembershipTitle: 'Acquérir un abonnement',
        acquireMembershipDescription: 'Choisissez un plan pour débloquer toutes les demandes et améliorer votre visibilité.',
        daysOfAccess: 'jours d\'accès illimité',
        buyFor: 'Acheter pour',
        finishServiceTitle: 'Terminer le service',
        completionDate: 'Date de fin',
        rateClient: 'Évaluer le client',
        confirm: 'Confirmer',
        confirmDeletion: 'Confirmer la suppression',
        confirmDeleteHistory: 'Êtes-vous sûr de vouloir supprimer cet enregistrement de l\'historique ? Cette action est irréversible.',
        yesDelete: 'Oui, supprimer',
        editAvailability: 'Modifier la disponibilité',
        describeYourSchedule: 'Décrivez votre horaire',
        schedulePlaceholder: 'Ex : Lundi au Vendredi, 9h - 17h',
        newServiceRequest: 'Vous avez reçu une nouvelle demande de service !',
        loadingProfile: 'Chargement du profil...',
        profileSavedForReview: 'Profil enregistré et envoyé pour révision.',
        couldNotSaveProfile: 'Impossible d\'enregistrer le profil.',
        attendanceSaved: 'Service terminé et évalué avec succès.',
        couldNotSaveAttendance: 'Impossible d\'enregistrer les informations.',
        completeDateAndRatingError: 'Veuillez compléter la date et l\'évaluation.',
        availabilitySaved: 'Disponibilité enregistrée avec succès.',
        couldNotSaveAvailability: 'Impossible d\'enregistrer la disponibilité.',
        recordDeleted: 'Enregistrement supprimé de l\'historique.',
        couldNotDeleteRecord: 'Impossible de supprimer l\'enregistrement.',
        invalidPhoneNumber: 'Le numéro de téléphone fourni n\'est pas valide.',
        completedServices: 'Services terminés',
        averageRating: 'Évaluation moyenne',
        notYetRated: "Pas encore évalué",
        remindToRate: "Rappeler d'évaluer",
        reminderSent: "Rappel envoyé avec succès.",
        errorSendingReminder: "Erreur lors de l'envoi du rappel.",
    },

    // Admin Dashboard
    admin: {
        dashboardTitle: 'Tableau de bord Administrateur',
        pendingProfiles: 'Profils en attente de révision',
        manageMemberships: 'Gérer les abonnements',
        requestsMonitor: 'Moniteur de demandes',
        globalJobSettings: 'Paramètres globaux des emplois',
        jobDeletionRequests: 'Demandes de suppression d\'emplois',
        configureRecommenderPayouts: 'Configurer les paiements des Recommandeurs',
        userManagement: 'Gestion des utilisateurs',
        loading: 'Chargement...',
        noPendingProfiles: 'Aucun profil en attente.',
        approve: 'Approuver',
        reject: 'Rejeter',
        noMembershipPlans: 'Aucun plan d\'abonnement.',
        addMembership: 'Ajouter un abonnement',
        noServiceRequests: 'Aucune demande de service.',
        from: 'De',
        to: 'À',
        status: 'Statut',
        maxApplicantsLimit: 'Limite maximale de candidats',
        maxApplicantsDescription: 'Ce nombre s\'appliquera à toutes les offres d\'emploi. Laissez vide pour ne pas avoir de limite.',
        noLimit: 'Pas de limite',
        save: 'Enregistrer',
        noPendingDeletions: 'Aucune demande de suppression en attente.',
        recommender: 'Recommandeur',
        approveDeletion: 'Approuver la suppression',
        rejectDeletion: 'Rejeter',
        payoutPerVerifiedJob: 'Paiement par emploi vérifié ($)',
        payoutPerApplication: 'Paiement par candidature ($)',
        payoutPerConfirmedHire: 'Paiement par embauche confirmée ($)',
        saveConfiguration: 'Enregistrer la configuration',
        advancedSearch: 'Recherche avancée',
        searchByName: 'Rechercher par nom...',
        searchByEmail: 'Rechercher par e-mail...',
        allRoles: 'Tous les rôles',
        tableHeaderName: 'Nom',
        tableHeaderEmail: 'E-mail',
        tableHeaderRole: 'Rôle',
        tableHeaderVerification: 'Vérification',
        tableHeaderActions: 'Actions',
        verificationSent: 'Envoyé',
        verificationNotSent: 'Non envoyé',
        removeVerification: 'Retirer la vérification',
        verify: 'Vérifier',
        showing: 'Affichage',
        of: 'de',
        editUser: 'Modifier l\'utilisateur',
        role: 'Rôle',
        editMembership: 'Modifier l\'abonnement',
        addMembershipTitle: 'Ajouter un abonnement',
        planName: 'Nom du plan',
        price: 'Prix ($)',
        durationDays: 'Durée (jours)',
        durationDaysHelpText: 'Définit pendant combien de jours l\'abonnement sera valide après l\'achat.',
        createPlan: 'Créer le plan',
        confirmDeletion: 'Confirmer la suppression',
        confirmDeleteUser: 'Êtes-vous sûr de vouloir supprimer',
        deleteUserWarning: 'Cette action est irréversible et supprimera toutes les données associées (profils, demandes, publications, etc.).',
        yesDeleteUser: 'Oui, supprimer l\'utilisateur',
        deleting: 'Suppression en cours...',
        confirmVerificationToggle: 'Êtes-vous sûr de vouloir',
        verifying: 'vérifier',
        unverifying: 'annuler la vérification de',
        professionalVerified: 'Professionnel vérifié avec succès.',
        professionalUnverified: 'Professionnel non vérifié avec succès.',
        couldNotUpdateVerification: 'Impossible de mettre à jour le statut de vérification.',
        userDeleted: 'Utilisateur et toutes ses données associées ont été supprimés.',
        errorDeletingUser: 'Une erreur est survenue lors de la suppression de l\'utilisateur.',
        confirmDeleteMembership: 'Êtes-vous sûr de vouloir supprimer ce plan d\'abonnement ?',
        globalSettingsSaved: 'Paramètres globaux enregistrés avec succès.',
        couldNotSaveGlobalSettings: 'Impossible d\'enregistrer les paramètres.',
        payoutSettingsSaved: 'Paramètres de paiement enregistrés.',
        errorSavingPayoutSettings: 'Erreur lors de l\'enregistrement des paramètres.',
        jobDeleted: 'Emploi et candidatures associées supprimés.',
        errorDeletingJob: 'Erreur lors de la suppression de l\'emploi.',
        deletionRejected: 'Demande de suppression rejetée. L\'emploi a été réactivé.',
        errorRejectingDeletion: 'Erreur lors du rejet de la demande.',
        systemTools: 'Outils système',
        sendTestEmail: 'Envoyer un e-mail de test',
        testEmailDescription: 'Vérifiez la configuration du serveur de messagerie en envoyant un message de test.',
        recipientEmail: 'E-mail du destinataire',
        sendTest: 'Envoyer le test',
        sendingTest: 'Envoi en cours...',
        testEmailSent: 'E-mail de test mis en file d\'attente. Vérifiez la boîte de réception de {email}.',
        testEmailError: 'Erreur lors de l\'envoi de l\'e-mail de test.',
        invalidEmail: 'Veuillez saisir une adresse e-mail valide.',
        subject: 'Sujet',
        messageBody: 'Corps du message',
        emailDeliveryStatus: 'Statut de livraison de l\'e-mail',
        statusPending: 'En attente... En attente de la réponse du serveur.',
        statusSuccess: 'Succès ! E-mail livré correctement.',
        statusError: 'Erreur lors de la livraison de l\'e-mail : {error}',
        editUserTitle: 'Modifier l\'utilisateur',
        userVerification: 'Vérification de l\'utilisateur',
        verified: 'Vérifié',
        notVerified: 'Non vérifié',
        toggleVerification: 'Changer la vérification',
        userUpdatedSuccess: 'Utilisateur mis à jour avec succès.',
        errorUpdatingUser: 'Erreur lors de la mise à jour de l\'utilisateur.',
        userVerifiedSuccess: 'Utilisateur vérifié.',
        userUnverifiedSuccess: 'Vérification de l\'utilisateur supprimée.',
        errorTogglingVerification: 'Erreur lors du changement du statut de vérification.',
        viewDetails: "Voir les détails",
        approveProfileTooltip: "Approuver le profil",
        rejectProfileTooltip: "Rejeter le profil",
        profileDetailsTitle: "Détails du profil professionnel",
        jobDetailsTitle: "Détails de l'emploi",
        idDocument: "Pièce d'identité",
        viewIdDocument: "Voir le document",
        noDocumentUploaded: "Aucun document n'a été téléversé.",
        actions: {
            deactivate: 'Désactiver',
            activate: 'Activer',
            confirmDeactivate: 'Confirmer la désactivation',
            confirmActivate: 'Confirmer l\'activation',
            deactivateMessage: 'Êtes-vous sûr de vouloir désactiver {name} ? L\'utilisateur ne pourra pas se connecter.',
            activateMessage: 'Êtes-vous sûr de vouloir activer {name} ? L\'utilisateur pourra se reconnecter.',
        },
        userStatuses: {
            active: 'Actif',
            disabled: 'Désactivé'
        },
        nav: {
            verifications: 'Vérifications',
            hiring: 'Recrutements et Paiements',
            users: 'Gestion des utilisateurs',
            config: 'Paramètres et Tarifs',
        },
        management: {
            manageJobs: 'Gérer les emplois',
            noUnverifiedJobs: 'Aucun emploi à vérifier.',
            verifyJob: 'Vérifier l\'emploi',
            manageApplications: 'Gérer les candidatures',
            noPendingHires: 'Aucune embauche en attente.',
            markAsHired: 'Marquer comme embauché',
            recommenderPayouts: 'Paiements des Recommandeurs',
            noPendingPayouts: 'Aucun gain en attente de paiement.',
            pendingAmount: 'Montant en attente',
            registerPayment: 'Enregistrer le paiement',
            paymentTo: 'Enregistrer le paiement pour',
            amountToPay: 'Montant à payer',
            paymentNotesOptional: 'Notes (Facultatif)',
            paymentProofOptional: 'Justificatif de paiement (Facultatif)',
            paymentProcessing: 'Traitement du paiement...',
            paymentSuccess: 'Paiement enregistré avec succès !',
            paymentError: 'Erreur lors de l\'enregistrement du paiement.',
            jobVerifiedSuccess: 'Emploi vérifié ! Un gain a été généré.',
            hireConfirmedSuccess: 'Embauche confirmée ! Un gain a été généré.',
            searchPlaceholder: 'Rechercher par candidat, emploi ou entreprise...',
            tableHeaderCandidate: 'Candidat',
            tableHeaderJob: 'Emploi',
            tableHeaderRecommender: 'Recommandeur',
            tableHeaderStatus: 'Statut',
            tableHeaderActions: 'Actions',
            updateStatusTitle: 'Mettre à jour le statut de la candidature',
            candidateInfo: 'Informations sur le candidat',
            recommenderInfo: 'Informations sur le recommandeur',
            viewCV: 'Voir le CV',
        },
    },

    // Shared components
    payment: {
        cardNumber: 'Numéro de carte',
        expiry: 'Expiration (MM/AA)',
        payNow: 'Payer maintenant',
        processing: 'Traitement en cours...',
        error: {
            fillAllFields: 'Veuillez remplir tous les champs de la carte.'
        }
    },
    publicJobView: {
        jobNotFound: "Offre d'emploi non trouvée.",
        errorLoadingJob: "Erreur lors du chargement de l'offre d'emploi.",
        applyNowLogin: "Connectez-vous pour postuler"
    },

    // Email Templates
    emails: {
        welcomeSubject: 'Bienvenue sur teRecomiendo !',
        welcomeBodySeeker: `
          <h1>Bienvenue sur teRecomiendo ! 👋</h1>
          <p>Merci de rejoindre la plateforme où votre recherche d'emploi devient plus claire, plus directe et plus efficace.</p>
          <p>Ici, vous pouvez :</p>
          <ul>
            <li>✅ Accéder à de vraies opportunités</li>
            <li>✅ Postuler avec le soutien d'un recommandeur</li>
            <li>✅ Recevoir des notifications sur l'état de vos candidatures</li>
            <li>✅ Entrer en contact avec des entreprises qui recherchent des talents comme vous</li>
            <li>✅ Entrer en contact avec des professionnels offrant des services</li>
          </ul>
          <p>C'est le premier pas vers une nouvelle opportunité professionnelle.<br>Nous sommes heureux de vous avoir ici !</p>
          <p>👉 Accédez à votre tableau de bord : <a href="https://terecomiendo.ca">https://terecomiendo.ca</a></p>
        `,
        welcomeBodyRecommender: `
          <h1>Bienvenue sur teRecomiendo ! 🙌</h1>
          <p>Merci de vous joindre en tant que recommandeur et de faire partie d'un réseau qui aide les autres à trouver du travail et à gagner des commissions.</p>
          <p>Sur notre plateforme, vous pouvez :</p>
          <ul>
            <li>✅ Publier des opportunités d'emploi</li>
            <li>✅ Recommander des candidats et les aider à postuler</li>
            <li>✅ Recevoir des notifications lorsque vos candidats recommandés postulent</li>
            <li>✅ Générer des revenus grâce à vos publications</li>
          </ul>
          <p>Votre rôle est essentiel pour créer des liens qui génèrent de réelles opportunités.<br>Merci de contribuer à cette communauté !</p>
          <p>👉 Accédez à votre compte : <a href="https://terecomiendo.ca">https://terecomiendo.ca</a></p>
        `,
        welcomeBodyProfessional: `
          <h1>Bienvenue sur teRecomiendo ! 🏢✨</h1>
          <p>Merci de vous joindre en tant que professionnel et de faire partie d'un réseau qui aide les autres à résoudre des problèmes et à répondre à des besoins professionnels.</p>
          <p>Sur notre plateforme, vous pouvez :</p>
          <ul>
            <li>✅ Créer et offrir des services vérifiés</li>
            <li>✅ Entrer en contact avec des personnes qui ont besoin de vrais services</li>
            <li>✅ Gérer facilement les candidatures depuis votre e-mail</li>
            <li>✅ Trouver des opportunités d'affaires</li>
          </ul>
          <p>Vous faites maintenant partie d'une communauté qui unit le talent des gens aux opportunités.</p>
          <p>👉 Entrez sur le portail d'entreprise : <a href="https://terecomiendo.ca">https://terecomiendo.ca</a></p>
        `,
        seekerToCompany: {
            subject: 'Nouveau candidat numéro({applicationId}) pour votre offre publiée par un recommandeur sur notre plateforme',
            body: `
                <h1>Message automatique de Te recomiendo.</h1>
                <p>Bonjour {companyName},</p>
                <p>L'utilisateur <strong>{seekerName}</strong> a postulé à votre offre d'emploi : <strong>{jobTitle}</strong>.</p>
                <hr>
                <h3>Détails du candidat :</h3>
                <ul>
                    <li><strong>Nom :</strong> {seekerName}</li>
                    <li><strong>E-mail :</strong> {seekerEmail}</li>
                    <li><strong>Téléphone :</strong> {seekerPhone}</li>
                    <li><strong>Document joint :</strong> <a href="{cvUrl}">Voir le CV</a></li>
                </ul>
                <hr>
                <h3>Recommandeur :</h3>
                <ul>
                    <li><strong>Nom :</strong> {recommenderName}</li>
                    <li><strong>E-mail :</strong> {recommenderEmail}</li>
                    <li><strong>Téléphone :</strong> {recommenderPhone}</li>
                </ul>
                <hr>
                <p>Pour faciliter le processus, vous pouvez répondre directement à cet e-mail en indiquant l'une des options suivantes :</p>
                <ol>
                    <li><strong>INTÉRESSÉ</strong> — Je souhaite contacter le candidat</li>
                    <li><strong>POUR ENTRETIEN</strong> — Envoyer une date et une heure suggérées</li>
                    <li><strong>NON SÉLECTIONNÉ</strong> — Ne correspond pas au profil</li>
                    <li><strong>POSTE POURVU</strong> — Nous avons embauché le candidat</li>
                </ol>
                <p>Votre réponse sera automatiquement enregistrée sur la plateforme pour maintenir la traçabilité.</p>
                <br>
                <p>Merci beaucoup,<br><strong>Te Recomiendo</strong><br><em>Votre plateforme qui connecte les talents avec les opportunités d'emploi.</em></p>
                <p><a href="https://terecomiendo.ca">https://terecomiendo.ca</a></p>
            `
        },
        seekerToRecommender: {
            subject: 'Un candidat a postulé à votre offre : {jobTitle}',
            body: `
                <h1>Notification de candidature</h1>
                <p>Bonjour {recommenderName},</p>
                <p>Le candidat <strong>{seekerName}</strong> a postulé à l'offre d'emploi "<strong>{jobTitle}</strong>" que vous avez publiée.</p>
                <p><strong>Lettre de motivation :</strong></p>
                <p><em>{coverLetter}</em></p>
                <p><strong>Document joint :</strong> <a href="{cvUrl}">Voir le CV</a></p>
                <p>Merci pour votre contribution à la communauté.</p>
            `
        },
        failedLoginsWarningSubject: 'Alerte de sécurité : Tentatives de connexion à votre compte',
        failedLoginsWarningBody: '<h1>Alerte de sécurité</h1><p>Bonjour,</p><p>Nous avons détecté plusieurs tentatives de connexion infructueuses à votre compte. Si ce n\'était pas vous, nous vous recommandons de réinitialiser votre mot de passe immédiatement.</p>',
        passwordChangedSubject: 'Confirmation de changement de mot de passe',
        passwordChangedBody: '<h1>Votre mot de passe a été modifié</h1><p>Bonjour {name},</p><p>Cet e-mail confirme que le mot de passe de votre compte a été modifié avec succès. Si vous n\'avez pas effectué ce changement, veuillez contacter notre support immédiatement.</p>',
        professional: {
            profileSubmittedSubject: 'Votre profil professionnel est en cours de révision',
            profileSubmittedBody: '<h1>Nous avons reçu votre profil</h1><p>Bonjour {name},</p><p>Merci d\'avoir soumis votre profil professionnel. Notre équipe l\'examinera et vous informera une fois qu\'il sera approuvé. Ce processus prend généralement 24 à 48 heures.</p>',
            profileApprovedSubject: 'Votre profil professionnel a été approuvé !',
            profileApprovedBody: '<h1>Félicitations, {name} !</h1><p>Votre profil professionnel sur teRecomiendo a été approuvé. Vous êtes maintenant visible pour les chercheurs et pouvez commencer à recevoir des demandes de service.</p><p>Nous vous souhaitons beaucoup de succès !</p>',
            newServiceRequestSubject: 'Nouvelle demande de service reçue !',
            newServiceRequestBody: '<h1>Vous avez une nouvelle demande</h1><p>Bonjour {name},</p><p>Vous avez reçu une nouvelle demande de service de la part de <strong>{seekerName}</strong>. Connectez-vous à votre tableau de bord pour voir les détails et répondre.</p>',
            ratingReminderSubject: "Rappel pour évaluer notre service",
            ratingReminderBody: "<h1>Bonjour {seekerName} !</h1><p>Nous espérons que vous avez été satisfait de notre service. <strong>{professionalName}</strong> vous serait reconnaissant de prendre un moment pour laisser une évaluation.</p><p>Votre avis est très précieux pour nous et pour la communauté de teRecomiendo.</p><p><a href='https://terecomiendo.ca'>Cliquez ici pour évaluer</a></p><p>Merci !</p>"
        },
        recommender: {
            jobPublishedSubject: 'Vous avez publié une nouvelle offre d\'emploi',
            jobPublishedBody: '<h1>Offre publiée !</h1><p>Bonjour {name},</p><p>Votre offre d\'emploi "<strong>{jobTitle}</strong>" a été publiée avec succès. Elle est maintenant en attente de vérification par un administrateur.</p>',
            jobVerifiedSubject: 'Votre offre d\'emploi a été vérifiée !',
            jobVerifiedBody: '<h1>Offre vérifiée !</h1><p>Bonjour {name},</p><p>Votre offre d\'emploi "<strong>{jobTitle}</strong>" a été vérifiée par notre équipe. Merci pour votre contribution ! Vous avez gagné ${amount} pour cette action.</p>',
            hireConfirmedSubject: 'Un candidat a été embauché !',
            hireConfirmedBody: '<h1>Félicitations, {name} !</h1><p>Le candidat <strong>{seekerName}</strong> a été embauché pour le poste "<strong>{jobTitle}</strong>". Vous avez gagné ${amount} pour cette embauche confirmée !</p>',
            forwardedToCompanySubject: 'Nouveau candidat pour votre offre [Réf : {applicationId}]',
            forwardedToCompanyBody: `
              <p>Bonjour {companyName},</p>
              <p>L'utilisateur <strong>{seekerName}</strong> a postulé à votre offre d'emploi : <strong>{jobTitle}</strong>, via notre plateforme teRecomiendo.</p>
              <hr>
              <h3>Détails du candidat :</h3>
              <ul>
                <li><strong>Nom :</strong> {seekerName}</li>
                <li><strong>E-mail :</strong> {seekerEmail}</li>
                <li><strong>Téléphone :</strong> {seekerPhone}</li>
              </ul>
              <p><strong>Lettre de motivation :</strong></p>
              <p><em>{coverLetter}</em></p>
              <p><strong>Document joint :</strong> <a href="{cvUrl}">Voir le CV</a></p>
              <hr>
              <h3>Recommandeur :</h3>
              <ul>
                <li><strong>Nom :</strong> {recommenderName}</li>
                <li><strong>E-mail :</strong> {recommenderEmail}</li>
                <li><strong>Téléphone :</strong> {recommenderPhone}</li>
              </ul>
              <hr>
              <p><strong>Pour faciliter le processus, vous pouvez répondre directement à cet e-mail en indiquant l'une des options suivantes dans l'objet pour mettre à jour le statut du candidat sur notre plateforme :</strong></p>
              <ul>
                <li><strong>INTÉRESSÉ</strong> — Pour indiquer que vous souhaitez contacter le candidat.</li>
                <li><strong>POUR ENTRETIEN</strong> — Pour indiquer que le candidat passe à un entretien.</li>
                <li><strong>NON SÉLECTIONNÉ</strong> — Pour indiquer que le candidat ne correspond pas au profil.</li>
              </ul>
              <p>Votre réponse sera automatiquement enregistrée pour maintenir la traçabilité du processus.</p>
              <br>
              <p>Merci beaucoup,<br><strong>Te Recomiendo</strong><br><em>La plateforme qui connecte les gens aux opportunités</em></p>
            `,
        }
    },
    help: {
        title: 'Centre d\'aide',
        backToDashboard: 'Retour au tableau de bord',
        seeker: {
            title: 'Aide pour les Chercheurs',
            description: 'Trouvez des réponses aux questions les plus courantes sur la recherche d\'emplois et de professionnels.',
            faqs: [
                { q: 'Comment rechercher des emplois ou des professionnels ?', a: 'Dans la section "Recherche avancée" de votre tableau de bord, vous pouvez choisir entre deux onglets : "Professionnels" et "Emplois". Utilisez les champs de recherche pour filtrer par nom, spécialité, mot-clé ou ville et cliquez sur "Rechercher" pour voir les résultats.' },
                { q: 'Que signifie l\'icône en forme de cœur ❤️ à côté d\'une offre d\'emploi ?', a: 'C\'est le bouton "Favoris". Vous pouvez cliquer dessus pour enregistrer les offres d\'emploi qui vous intéressent le plus et les consulter plus tard sans avoir à les rechercher à nouveau.' },
                { q: 'Comment postuler à une offre d\'emploi ?', a: 'Une fois que vous avez trouvé une offre qui vous intéresse, cliquez sur "Voir les détails". Une fenêtre s\'ouvrira avec les informations complètes. Si l\'offre doit être débloquée, vous aurez la possibilité de le faire. Ensuite, vous pourrez remplir le formulaire de candidature en joignant votre CV et une lettre de motivation facultative.' },
                { q: "Comment puis-je connaître l'état de ma candidature ?", a: 'Sur votre tableau de bord, allez dans la section "Mes candidatures". Chaque candidature dispose d\'un "Suivi de la candidature" visuel qui vous montre à quelle étape elle se trouve, depuis son envoi jusqu\'à la décision de l\'entreprise.' },
                { q: 'Puis-je modifier ma candidature après l\'avoir envoyée ?', a: 'Oui. Dans "Mes candidatures", vous pouvez cliquer sur le bouton "Modifier" (icône de crayon) pour mettre à jour votre lettre de motivation ou joindre une nouvelle version de votre CV.' },
                { q: 'Comment puis-je évaluer le recommandeur d\'un emploi ?', a: 'Dans la liste "Mes candidatures", vous verrez un bouton "Évaluer" sur chaque candidature. En cliquant dessus, vous pourrez laisser une évaluation par étoiles pour le recommandeur qui a publié cette offre.' },
                { q: 'Comment demander un service à un professionnel ?', a: 'Après avoir recherché et trouvé un professionnel, cliquez sur le bouton "Voir et Contacter". Une fenêtre s\'ouvrira où vous pourrez voir son profil complet et remplir un formulaire pour lui envoyer une demande. Vous pouvez détailler le motif, la description, la date, l\'heure, votre emplacement et même joindre une photo pour donner plus de contexte.' },
                { q: 'Que signifient les statuts "En cours", "Acceptée" et "Terminée" dans mes demandes ?', a: 'En cours : Votre demande a été envoyée et attend que le professionnel la voie et l\'accepte. Acceptée : Bonne nouvelle ! Le professionnel a débloqué votre demande et vous contactera probablement bientôt. Terminée : Le service a été effectué et marqué comme terminé par le professionnel.' },
                { q: 'Comment puis-je évaluer un professionnel après avoir reçu un service ?', a: 'Une fois qu\'un professionnel marque le service comme "Terminé", un bouton "Évaluer" apparaîtra sur cette demande dans votre tableau de bord "Mes demandes de service".' },
                { q: 'Comment mettre à jour mes informations personnelles ou ma photo de profil ?', a: 'Dans la carte "Mon profil" de votre tableau de bord, cliquez sur le bouton "Modifier le profil". Vous pourrez mettre à jour votre nom, numéro de téléphone, ville, photo et autres données personnelles.' },
                { q: 'Puis-je annuler une demande de service que j\'ai déjà envoyée ?', a: 'Oui. Tant qu\'une demande de service est "En cours", vous verrez un bouton "Annuler" (icône de corbeille) qui vous permettra de l\'annuler si vous n\'avez plus besoin du service.' },
                { q: 'Puis-je supprimer de mon historique les demandes déjà terminées ?', a: 'Oui. Une fois qu\'un service a été "Terminé" et que vous l\'avez "Évalué", un bouton "Supprimer" apparaîtra pour que vous puissiez nettoyer votre historique et garder votre tableau de bord organisé.' }
            ]
        },
        professional: {
            title: 'Aide pour les Professionnels',
            description: 'Réponses sur la gestion de votre profil, de vos services et des demandes de vos clients.',
            faqs: [
                { q: 'Comment modifier mon profil ?', a: 'Sur votre tableau de bord, cliquez sur le bouton "Modifier le profil". Vous pourrez mettre à jour votre spécialité, votre biographie, vos services, votre photo et vos coordonnées. N\'oubliez pas de télécharger votre pièce d\'identité pour la vérification.' },
                { q: 'Pourquoi mon profil est-il "en attente de révision" ?', a: 'Tous les profils nouveaux ou modifiés passent par un processus de révision par nos administrateurs pour garantir la qualité et la sécurité de la plateforme. Ce processus prend généralement 24 à 48 heures.' },
                { q: 'Comment puis-je voir les coordonnées d\'un client qui a demandé un service ?', a: 'Les nouvelles demandes apparaissent avec les données du client verrouillées. Pour les déverrouiller, vous devez avoir un abonnement actif ou effectuer un paiement unique pour cette demande. Cliquez sur "Voir les données du client" pour voir les options.' },
                { q: 'Comment marquer un service comme terminé ?', a: 'Une fois que vous avez débloqué et contacté le client et que le service est terminé, allez à la demande sur votre tableau de bord et cliquez sur "Terminer le service". Vous pourrez indiquer la date de fin et évaluer le client.' }
            ]
        },
        recommender: {
            title: 'Aide pour les Recommandeurs',
            description: 'Apprenez à publier des emplois, à gérer vos gains et à tirer le meilleur parti de la plateforme.',
            faqs: [
                { q: 'Comment publier une nouvelle offre d\'emploi ?', a: 'Sur votre tableau de bord, vous trouverez le formulaire "Publier une nouvelle offre d\'emploi". Remplissez tous les détails de l\'emploi comme le titre, l\'entreprise et la description, puis cliquez sur "Publier l\'offre".' },
                { q: 'Comment puis-je gagner de l\'argent en tant que recommandeur ?', a: 'Vous gagnez de l\'argent de plusieurs manières : un montant pour chaque emploi que vous publiez et qui est vérifié, un autre pour chaque candidature que votre offre reçoit, et une commission plus importante si un candidat est embauché. Vous pouvez consulter les tarifs dans la section "Programme Officiel des Recommandeurs".' },
                { q: 'Où puis-je voir mes gains ?', a: 'Dans la carte "Mes gains" de votre tableau de bord, vous pouvez voir un résumé de vos gains en attente et payés, ainsi que l\'historique des paiements que vous avez reçus.' },
                { q: 'Que signifie qu\'un emploi est "en attente de vérification" ?', a: 'Cela signifie qu\'un administrateur examine votre publication pour s\'assurer qu\'il s\'agit d\'une offre d\'emploi réelle et qu\'elle respecte nos politiques. Une fois vérifiée, vous recevrez votre gain correspondant.' },
                { q: 'Comment puis-je suivre une candidature pour savoir s\'ils ont été embauchés ?', a: 'Sur votre tableau de bord, dans la section "Mes offres publiées", cliquez sur le bouton "Candidats" d\'une offre. Si un administrateur a confirmé une embauche, vous verrez une étiquette "EMBAUCHÉ" à côté du nom du candidat.' }
            ]
        }
    }
  }
};
// Replace the incorrect object mappings with direct string translations for roles.
(translations.es as any).Buscador = 'Buscador';
(translations.es as any).Recomendador = 'Recomendador';
(translations.es as any).Profesional = 'Profesional';
(translations.es as any).Admin = 'Admin';
(translations.en as any).Buscador = 'Seeker';
(translations.en as any).Recomendador = 'Recommender';
(translations.en as any).Profesional = 'Professional';
(translations.en as any).Admin = 'Admin';
(translations.fr as any).Buscador = 'Chercheur';
(translations.fr as any).Recomendador = 'Recommandeur';
(translations.fr as any).Profesional = 'Professionnel';
(translations.fr as any).Admin = 'Admin';