
export const getActionBadge = (action: string) => {
  const colors = {
    'CREATE_USER': 'bg-green-100 text-green-800',
    'UPDATE_USER': 'bg-blue-100 text-blue-800',
    'DELETE_USER': 'bg-red-100 text-red-800',
    'UPDATE_SUBSCRIPTION': 'bg-purple-100 text-purple-800',
    'RESET_PASSWORD': 'bg-yellow-100 text-yellow-800'
  };
  return colors[action as keyof typeof colors] || 'bg-gray-100 text-gray-800';
};

export const formatActionType = (action: string) => {
  const actions = {
    'CREATE_USER': 'Criar Usuário',
    'UPDATE_USER': 'Atualizar Usuário',
    'DELETE_USER': 'Deletar Usuário',
    'UPDATE_SUBSCRIPTION': 'Atualizar Plano',
    'RESET_PASSWORD': 'Resetar Senha'
  };
  return actions[action as keyof typeof actions] || action;
};
